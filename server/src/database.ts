import SQLite from 'better-sqlite3';

import { Query } from './features/db-utils/query.js';
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

//console.log(code);


const singleRecord = Query.getById('modules', '1');
const whereRecord = Query.getByWhere('modules')
	.fields('code')
	.where('code', 'LIKE', '%test%')
	.run();


console.log(whereRecord);
