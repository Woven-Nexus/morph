import { faker } from '@faker-js/faker';
import { range } from '@roenlie/mimic-core/array';
import SQLite from 'better-sqlite3';

import { escapeSQLiteString } from './features/db-utils/escape-string.js';
import { Filter, Query } from './features/db-utils/query.js';
import { sql } from './features/db-utils/sql.js';

const db = new SQLite('./database/main.db');
db.pragma('journal_mode = WAL');

db.prepare(sql`DROP TABLE IF EXISTS modules`).run();
db.prepare(sql`
CREATE TABLE modules (
	module_id INTEGER PRIMARY KEY,
	code TEXT DEFAULT '' NOT NULL,
	name TEXT DEFAULT '' NOT NULL,
	description TEXT DEFAULT '' NOT NULL,
	namespace TEXT DEFAULT '' NOT NULL,
	active INTEGER DEFAULT FALSE NOT NULL
)`).run();


const createCodeModule = (): IModule => {
	return {
		active:      1,
		namespace:   escapeSQLiteString(faker.hacker.adjective()),
		name:        escapeSQLiteString(faker.hacker.verb()),
		description: escapeSQLiteString(faker.hacker.phrase()),
		code:        escapeSQLiteString(faker.lorem.paragraph()),
	};
};

const insertCode = db.transaction(() => {
	range(20).forEach(() => {
		const mod = createCodeModule();

		db.prepare(sql`
		INSERT INTO modules ('active', 'code', 'description', 'name', 'namespace')
		VALUES(${ mod.active },'${ mod.code }','${ mod.description }','${ mod.name }','${ mod.namespace }')
		`).run();
	});
});

insertCode();


export interface IModule {
	module_id?: string;
	code: string;
	name: string;
	namespace: string;
	description: string;
	active: 0 | 1;
}

//const filter = new Filter<IModule>();
//const query = new Query('./database/main.db');

//const whereRecord = query
//	.get<IModule>('modules')
//	.where(
//		filter.exists('name'),
//	)
//	.orderBy('active', 'asc')
//	.query();
