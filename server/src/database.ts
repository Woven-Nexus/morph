import SQLite from 'better-sqlite3';

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
	active INTEGER DEFAULT FALSE NOT NULL
)`).run();


db.prepare(sql`
INSERT INTO modules (code)
VALUES('export const testFn = () => "test";')
`).run();


const code = db.prepare(sql`
SELECT * FROM modules
`).all();


interface IModule {
	module_id: string;
	code: string;
	name: string;
	description: string;
	active: 0 | 1;
}

const filter = new Filter<IModule>();
const query = new Query('./database/main.db');

const whereRecord = query
	.get<IModule>('modules')
	.where(
		filter.startsWith('code', 'export'),
		filter.exists('name'),
	)
	.orderBy('active', 'asc')
	.limit(1)
	.query();
