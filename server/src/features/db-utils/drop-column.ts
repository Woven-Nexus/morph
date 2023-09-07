import type SQLite from 'better-sqlite3';

import { sql } from './sql.js';


export const dropColumn = (db: SQLite.Database, table: string, column: string) => {
	//const result = db.prepare(sql`
	//SELECT sql FROM sqlite_master
	//WHERE tbl_name = '${ table }' AND type = 'table'
	//`).get() as {sql: string};
	const result = db.prepare(sql`PRAGMA table_info(${ table });`).all() as {
		cid: number;
		name: string;
		type: string;
		notnull: 0 | 1;
		dflt_value: null | string | number;
		pk: 0 | 1;
	}[];

	const newColumns = result.filter(def => def.name !== column);
	const columnNames = newColumns.map(def => def.name).join(',');

	const newStringColumns = newColumns.map(def => {
		return [
			def.name,
			def.type,
			def.notnull ? 'NOT NULL' : '',
			def.pk ? 'PRIMARY KEY' : '',
		].filter(Boolean).join(' ');
	}).join(',');

	const dropAndRemakeTable = db.transaction(() => {
		// disable foreign key constraint check
		db.pragma('foreign_keys=off');

		db.prepare(sql`
		-- Here you can drop column
		CREATE TABLE IF NOT EXISTS new_table(
			${ newStringColumns }
		);
		`).run();

		db.prepare(sql`
		-- copy data from the table to the new_table
		INSERT INTO new_table(${ columnNames })
		SELECT ${ columnNames }
		FROM ${ table };
		`).run();

		db.prepare(sql`
		-- drop the table
		DROP TABLE ${ table };
		`).run();

		db.prepare(sql`
		-- rename the new_table to the table
		ALTER TABLE new_table RENAME TO ${ table };
		`).run();

		// enable foreign key constraint check
		db.pragma('foreign_keys=on');
	});


	dropAndRemakeTable();
	const success = db.prepare(sql`PRAGMA table_info(${ table });`).all();

	console.log(success);
};
