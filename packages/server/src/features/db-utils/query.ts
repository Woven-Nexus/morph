import SQLite from 'better-sqlite3';

import type { Branded } from '../../utilities/brand.js';
import { exists } from '../../utilities/exists.js';


// Wrapper around Better SQLite3
// Purpose is to obscure away the database hooks that I will add into
// all interactions with the actual DB.
export class Query {

	#db: SQLite.Database;

	constructor(filename: string) {
		this.#db = new SQLite(filename);
		this.#db.pragma('journal_mode = WAL');
	}

	public from<T extends object = object>(table: string) {
		return new SelectBuilder<T>(this.#db, table);
	}

	public update<T extends object = object>(table: string) {
		return new UpdateBuilder<T>(this.#db, table);
	}

}


class SelectBuilder<T extends object = object> {

	#select: string[] = [];
	#where = '';
	#groupBy: string[] = [];
	#orderBy: string[] = [];
	#limit?: number;
	#offset?: number;

	constructor(
		protected db: SQLite.Database,
		protected table: string,
	) {}

	public select<K extends Extract<keyof T, string>>(...field: K[]) {
		this.#select ??= [];
		field.forEach(field => this.#select.push(field));

		return this as SelectBuilder<Pick<T, K>>;
	}

	public where(filter: (filter: Filter<T>) => FilterCondition) {
		this.#where = filter(new Filter());

		return this;
	}

	public groupBy(...field: Extract<keyof T, string>[]) {
		this.#groupBy = field;

		return this;
	}

	public orderBy(
		field: Extract<keyof T, string>,
		order: 'asc' | 'desc' = 'asc',
		nullsLast?: true,
	) {
		this.#orderBy.push(
			`${ field } ${ order.toUpperCase() }` +
			`${ nullsLast ? ' NULLS LAST' : '' }`,
		);

		return this;
	}

	public limit(limit: number) {
		this.#limit = limit;

		return this;
	}

	public offset(offset: number) {
		this.#offset = offset;

		return this;
	}

	protected build() {
		const select = 'SELECT ' + (this.#select.length ? this.#select.join(',') : '*');
		const from = 'FROM ' + this.table;
		const where = this.#where
			? 'WHERE ' + this.#where
			: '';
		const groupBy = this.#groupBy.length
			? 'GROUP BY ' + this.#groupBy.join(',')
			: '';
		const orderby = this.#orderBy.length
			? 'ORDER BY ' + this.#orderBy.join(',')
			: '';
		const limit = !exists(this.#limit) && exists(this.#offset)
			? 'LIMIT -1 OFFSET ' + this.#offset
			: exists(this.#limit) && !exists(this.#offset)
				? 'LIMIT ' + this.#limit
				: exists(this.#limit) && exists(this.#offset)
					? 'LIMIT ' + this.#limit + ' OFFSET ' + this.#offset
					: '';

		const qry = [
			select,
			from,
			where,
			groupBy,
			orderby,
			limit,
		].join('\n');

		return qry;
	}

	public query() {
		return new Results(this.db.prepare(this.build()).all() as T[]);
	}

}


class UpdateBuilder<T extends object = object> {

	#set: [name: string, value: any][] = [];
	#where = '';
	#orderBy: string[] = [];
	#limit?: number;
	#offset?: number;

	constructor(
		protected db: SQLite.Database,
		protected table: string,
	) {}

	public set<K extends Extract<keyof T, string>>(...field: [name: K, value: any][]) {
		field.forEach(field => this.#set.push(field));

		return this as UpdateBuilder<T>;
	}

	public where(filter: (filter: Filter<T>) => FilterCondition) {
		this.#where = filter(new Filter());

		return this;
	}

	public orderBy(
		field: Extract<keyof T, string>,
		order: 'asc' | 'desc' = 'asc',
		nullsLast?: true,
	) {
		this.#orderBy.push(
			`${ field } ${ order.toUpperCase() }` +
			`${ nullsLast ? ' NULLS LAST' : '' }`,
		);

		return this;
	}

	public limit(limit: number) {
		this.#limit = limit;

		return this;
	}


	public offset(offset: number) {
		this.#offset = offset;

		return this;
	}

	protected build() {
		const update = 'UPDATE ' + this.table;

		const set = 'SET ' + this.#set
			.map(([ name, value ]) => `${ name } = '${ value }'`)
			.join(',\n');

		const where = this.#where
			? 'WHERE ' + this.#where
			: '';

		const order = this.#orderBy.length
			? 'ORDER ' + this.#orderBy.join(',')
			: '';

		const limit = !exists(this.#limit) && exists(this.#offset)
			? 'LIMIT -1 OFFSET ' + this.#offset
			: exists(this.#limit) && !exists(this.#offset)
				? 'LIMIT ' + this.#limit
				: exists(this.#limit) && exists(this.#offset)
					? 'LIMIT ' + this.#limit + ' OFFSET ' + this.#offset
					: '';

		const qry = [
			update,
			set,
			where,
			order,
			limit,
		].join('\n');

		return qry;
	}

	public query() {
		return this.db.prepare(this.build()).run();
	}

}


type FilterCondition = Branded<string, 'FilterCondition'>;
export class Filter<T = Record<string, string | number>> {

	public and(...conditions: FilterCondition[]) {
		return `${ conditions.join(' AND ') }` as FilterCondition;
	}

	public or(...conditions: FilterCondition[]) {
		return `(${ conditions.join(' OR ') })` as FilterCondition;
	}

	public eq<K extends Extract<keyof T, string>>(field: K, value: T[K]) {
		return `${ field } = '${ value }'` as FilterCondition;
	}

	public startsWith(field: Extract<keyof T, string>, value: string) {
		const mustEscape = this.mustEscape(value);
		if (mustEscape)
			value = this.escape(value);

		return this.finalize(`${ field } LIKE '${ value }%'`, mustEscape);
	}

	public endsWith(field: Extract<keyof T, string>, value: string) {
		const mustEscape = this.mustEscape(value);
		if (mustEscape)
			value = this.escape(value);

		return this.finalize(`${ field } LIKE '%${ value }'`, mustEscape);
	}

	public contains(field: Extract<keyof T, string>, value: string) {
		const mustEscape = this.mustEscape(value);
		if (mustEscape)
			value = this.escape(value);

		return this.finalize(`${ field } LIKE '%${ value }%'`, mustEscape);
	}

	public oneOf<K extends Extract<keyof T, string>>(field: K, ...values: T[K][]) {
		return `${ field } IN (${ values.join(',') })` as FilterCondition;
	}

	public notOneOf<K extends Extract<keyof T, string>>(field: K, ...values: T[K][]) {
		return `${ field } NOT IN (${ values.join(',') })` as FilterCondition;
	}

	public exists(field: Extract<keyof T, string>) {
		return `${ field } IS NOT NULL` as FilterCondition;
	}

	public notExists(field: Extract<keyof T, string>) {
		return `${ field } IS NULL` as FilterCondition;
	}

	public glob(field: Extract<keyof T, string>, value: string) {
		return `${ field } GLOB '${ value }'` as FilterCondition;
	}

	protected mustEscape(value: string) {
		const mustEscape = value.includes('%') || value.includes('_');

		return mustEscape;
	}

	protected escape(value: string) {
		return value = value.replaceAll(/%/g, '\\%')
			.replaceAll(/_/g, '\\_');
	}

	protected finalize(value: string, escape: boolean) {
		return value + (escape ? ` ESCAPE '\\'` : '') as FilterCondition;
	}

}


export class Results<T extends Record<string, any> = Record<string, any>> {

	#items: (T | Result<T>)[] = [];

	constructor(items: T[]) {
		this.#items = items;
	}

	public forEach(func: (result: Result<T>) => any) {
		for (let i = 0; i < this.#items.length; i++) {
			let item = this.#items[i]!;
			if (!(item instanceof Result))
				item = this.#items[i] = new Result(item);

			func(item);
		}
	}

	public at(index = 0) {
		return this.#items.at(index);
	}

}


class Result<T extends Record<string, any> = Record<string, any>> {

	#item: T;

	public get item() {
		return this.#item;
	}

	constructor(item: T) {
		this.#item = item;
	}

}
