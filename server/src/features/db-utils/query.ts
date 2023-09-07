import SQLite from 'better-sqlite3';

import { sql } from './sql.js';


// Wrapper around Better SQLite3
// Purpose is to obscure away the database hooks that I will add into
// all interactions with the actual DB.
export class Query {

	static #db: SQLite.Database =  new SQLite('./database/main.db');

	static {
		this.#db.pragma('journal_mode = WAL');
	}

	public static getById(table: string, id?: string) {

	}

	public static getByWhere(table: string) {
		return new WhereBuilder(this.#db, table);
	}

}


class WhereBuilder {

	#select?: string[];
	#where?: string[];

	constructor(
		protected db: SQLite.Database,
		public table: string,
	) {}

	public fields(...field: string[]) {
		this.#select ??= [];
		field.forEach(field => this.#select?.push(field));

		return this;
	}

	public where(field: string, operator: '=' | 'LIKE', value: string | number) {
		this.#where ??= [];

		const escapedValue = typeof value === 'string'
			? `'${ value }'`
			: value;

		this.#where.push(`${ field } ${ operator } ${ escapedValue }`);

		return this;
	}

	public run() {
		// Here we put the query together.
		const qry = sql`
		SELECT ${ this.#select?.join(',') ?? '*' }
		FROM ${ this.table }
		${ this.#where
		? 'WHERE ' + this.#where.join(' ')
		: '' }
		`;

		console.log(qry);


		return this.db.prepare(qry).all();
	}

}
