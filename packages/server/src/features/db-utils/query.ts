import SQLite from 'better-sqlite3';

import type { Branded } from '../../utilities/brand.js';
import { exists } from '../../utilities/exists.js';
import { escapeString } from './escape-string.js';


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

	public insert<T extends object  = object>(table: string) {
		return new InsertBuilder<T>(this.#db, table);
	}

	public update<T extends object = object>(table: string) {
		return new UpdateBuilder<T>(this.#db, table);
	}

	public delete<T extends object = object>(table: string) {
		return new DeleteBuilder<T>(this.#db, table);
	}

}


abstract class Builder {

	constructor(
		protected db: SQLite.Database,
		protected table: string,
	) {}

	protected abstract build(): string;

	public abstract query(): unknown;

}


class SelectBuilder<T extends object = object> extends Builder {

	#select = '';
	#where = '';
	#groupBy = '';
	#orderBy = '';
	#limit?: number;
	#offset?: number;

	public select(...field: Extract<keyof T, string>[]) {
		field.forEach((name) => {
			if (this.#select)
				this.#select += ',';

			this.#select += name;
		});

		return this as SelectBuilder<T>;
	}

	public where(filter: (filter: Filter<T>) => FilterCondition) {
		this.#where = filter(new Filter());

		return this;
	}

	public groupBy(...field: Extract<keyof T, string>[]) {
		field.forEach(field => {
			if (this.#groupBy)
				this.#groupBy += ',';

			this.#groupBy += field;
		});

		return this;
	}

	public orderBy(
		field: Extract<keyof T, string>,
		order: 'asc' | 'desc' = 'asc',
		nullsLast?: true,
	) {
		if (this.#orderBy)
			this.#orderBy += ',';

		this.#orderBy += `${ field } ${ order.toUpperCase() }`
			+ `${ nullsLast ? ' NULLS LAST' : '' }`;

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

	protected getLimitOffset() {
		const limitExists = exists(this.#limit);
		const offsetExists = exists(this.#offset);
		const bothExist = limitExists && offsetExists;
		const limitOnly = limitExists && !offsetExists;
		const offsetOnly = !limitExists && offsetExists;

		return bothExist   ? `LIMIT ${ this.#limit } OFFSET ${ this.#offset }`
			: limitOnly	    ? `LIMIT ${ this.#limit }`
				: offsetOnly ? `LIMIT -1 OFFSET ${ this.#offset }`
					: '';
	}

	protected build() {
		return `
		SELECT ${ this.#select ? this.#select : '*' }
		FROM ${ this.table }
		${ this.#where ? `WHERE ${ this.#where }` : '' }
		${ this.#groupBy ? `GROUP BY ${ this.#groupBy }` : '' }
		${ this.#orderBy ? `ORDER BY ${ this.#orderBy }` : '' }
		${ this.getLimitOffset() }
		`;
	}

	public query(): T[] {
		try {
			return this.db.prepare(this.build()).all() as T[];
		}
		catch (error) {
			console.error(error);

			return [];
		}
		finally {
			this.db.close();
		}
	}

}


class UpdateBuilder<T extends object = object> extends Builder {

	#values = '';
	#where = '';
	#orderBy?: string;
	#limit?: number;
	#offset?: number;

	public values(fields: Partial<T>) {
		Object.entries(fields).forEach(([ name, value ]) => {
			if (this.#values)
				this.#values += ',';

			if (typeof value === 'string')
				value = `'${ escapeString(value) }'`;

			this.#values += `${ name } = ${ value }`;
		});

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
		throw new Error('Using this requires '
			+ 'https://www.sqlite.org/compile.html#enable_update_delete_limit');

		if (this.#orderBy)
			this.#orderBy += ',';

		this.#orderBy += `${ field } ${ order.toUpperCase() }`
			+ `${ nullsLast ? ' NULLS LAST' : '' }`;

		return this;
	}

	public limit(limit: number) {
		throw new Error('Using this requires '
			+ 'https://www.sqlite.org/compile.html#enable_update_delete_limit');

		this.#limit = limit;

		return this;
	}

	public offset(offset: number) {
		throw new Error('Using this requires '
			+ 'https://www.sqlite.org/compile.html#enable_update_delete_limit');

		this.#offset = offset;

		return this;
	}

	protected getLimitOffset() {
		const limitExists = exists(this.#limit);
		const offsetExists = exists(this.#offset);
		const bothExist = limitExists && offsetExists;
		const limitOnly = limitExists && !offsetExists;
		const offsetOnly = !limitExists && offsetExists;

		return bothExist   ? `LIMIT ${ this.#limit } OFFSET ${ this.#offset }`
			: limitOnly	    ? `LIMIT ${ this.#limit }`
				: offsetOnly ? `LIMIT -1 OFFSET ${ this.#offset }`
					: '';
	}

	protected build() {
		return `
		UPDATE ${ this.table }
		SET ${ this.#values }
		${ this.#where ? `WHERE ${ this.#where }` : '' }
		${ this.#orderBy ? `ORDER ${ this.#orderBy }` : '' }
		${ this.getLimitOffset() }
		`;
	}

	public query() {
		try {
			return this.db.prepare(this.build()).run();
		}
		catch (error) {
			console.error(error);
		}
		finally {
			this.db.close();
		}
	}

}


class InsertBuilder<T extends object = object> extends Builder {

	#columns = '';
	#values = '';

	public values(fields: T) {
		Object.entries(fields).forEach(([ name, value ]) => {
			if (typeof value === 'string')
				value = `'${ escapeString(value) }'`;

			this.#values += (this.#values ? ',' : '') + value;
			this.#columns += (this.#columns ? ',' : '') + name;
		});

		return this;
	}

	protected build() {
		if (!this.#columns && !this.#values)
			return `INSERT INTO ${ this.table } DEFAULT VALUES`;

		return `
		INSERT INTO ${ this.table } (${ this.#columns })
		VALUES (${ this.#values })
		`;
	}

	public query() {
		try {
			return this.db.prepare(this.build()).run();
		}
		catch (error) {
			console.error(error);
		}
		finally {
			this.db.close();
		}
	}

}


class DeleteBuilder<T extends object = object> extends Builder {

	#where = '';

	public where(filter: (filter: Filter<T>) => FilterCondition) {
		this.#where = filter(new Filter());

		return this;
	}

	protected build() {
		return `
		DELETE FROM ${ this.table }
		WHERE ${ this.#where }
		`;
	}

	public query() {
		try {
			return this.db.prepare(this.build()).run();
		}
		catch (error) {
			console.error(error);
		}
		finally {
			this.db.close();
		}
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
