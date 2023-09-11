import SQLite from 'better-sqlite3';

import { sql } from './sql.js';


// Wrapper around Better SQLite3
// Purpose is to obscure away the database hooks that I will add into
// all interactions with the actual DB.
export class Query {

	#db: SQLite.Database;

	constructor(filename: string) {
		this.#db = new SQLite(filename);
		this.#db.pragma('journal_mode = WAL');
	}

	public get<T extends object = object>(table: string) {
		return new WhereBuilder<T>(this.#db, table);
	}

}

class WhereBuilder<T extends object = object> {

	#select: string[] = [];
	#where = '';
	#orderBy: string[] = [];
	#limit?: number;
	#offset?: number;

	constructor(
		protected db: SQLite.Database,
		public table: string,
	) {}

	public fields(...field: string[]) {
		this.#select ??= [];
		field.forEach(field => this.#select?.push(field));

		return this;
	}

	public where(...filters: FilterCondition[]) {
		this.#where = filters.join(' AND ');

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
		const where = this.#where ? 'WHERE ' + this.#where : '';
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

		const qry = sql`
		${ select }
		${ from }
		${ where }
		${ orderby }
		${ limit }
		`;

		return qry;
	}

	public first() {
		return this.db.prepare(this.build()).get();
	}

	public all() {
		return this.db.prepare(this.build()).all();
	}

}

type FilterCondition = string & {_sign: symbol};
export class Filter<T = Record<string, string | number>> {

	public and(...conditions: FilterCondition[]): FilterCondition {
		return `${ conditions.join(' AND ') }` as FilterCondition;
	}

	public or(...conditions: FilterCondition[]): FilterCondition {
		return `(${ conditions.join(' OR ') })` as FilterCondition;
	}

	public eq<K extends Extract<keyof T, string>>(field: K, value: T[K]): FilterCondition {
		return `${ field } = '${ value }'` as FilterCondition;
	}

	public startsWith(field: Extract<keyof T, string>, value: string): FilterCondition {
		const mustEscape = this.mustEscape(value);
		if (mustEscape)
			value = this.escape(value);

		return this.finalize(`${ field } LIKE '${ value }%'`, mustEscape);
	}

	public endsWith(field: Extract<keyof T, string>, value: string): FilterCondition {
		const mustEscape = this.mustEscape(value);
		if (mustEscape)
			value = this.escape(value);

		return this.finalize(`${ field } LIKE '%${ value }'`, mustEscape);
	}

	public contains(field: Extract<keyof T, string>, value: string): FilterCondition {
		const mustEscape = this.mustEscape(value);
		if (mustEscape)
			value = this.escape(value);

		return this.finalize(`${ field } LIKE '%${ value }%'`, mustEscape);
	}

	public oneOf<K extends Extract<keyof T, string>>(field: K, ...values: T[K][]): FilterCondition {
		return `${ field } IN (${ values.join(',') })` as FilterCondition;
	}

	public notOneOf<K extends Extract<keyof T, string>>(field: K, ...values: T[K][]): FilterCondition {
		return `${ field } NOT IN (${ values.join(',') })` as FilterCondition;
	}

	public exists(field: Extract<keyof T, string>): FilterCondition {
		return `${ field } IS NOT NULL` as FilterCondition;
	}

	public notExists(field: Extract<keyof T, string>): FilterCondition {
		return `${ field } IS NULL` as FilterCondition;
	}

	public glob(field: Extract<keyof T, string>, value: string): FilterCondition {
		return `${ field } GLOB '${ value }'` as FilterCondition;
	}

	protected mustEscape(value: string): boolean {
		const mustEscape = value.includes('%') || value.includes('_');

		return mustEscape;
	}

	protected escape(value: string): string {
		return value = value.replaceAll(/%/g, '\\%')
			.replaceAll(/_/g, '\\_');
	}

	protected finalize(value: string, escape: boolean): FilterCondition {
		return value + (escape ? ` ESCAPE '\\'` : '') as FilterCondition;
	}

}


const exists = <T>(value: T): value is T & Record<never, never> =>
	value !== undefined;