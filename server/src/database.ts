import Database from 'better-sqlite3';

const db = new Database('./database/foobar.db');
db.pragma('journal_mode = WAL');


const sql = (strings: TemplateStringsArray, ...values: unknown[]): string =>
	String.raw({ raw: strings }, ...values);


db.prepare(sql`
DROP TABLE IF EXISTS modules
`).run();

db.prepare(sql`
CREATE TABLE modules (
	module_id INTEGER PRIMARY KEY,
	code TEXT NOT NULL
)
`).run();


const insert = sql`
INSERT INTO modules (code)
VALUES ('console.log(\"hello\")')
`;
console.log(insert);

db.prepare(insert).run();

const readModules = db.prepare(sql`
SELECT * FROM modules
`).all();

console.log(readModules);
