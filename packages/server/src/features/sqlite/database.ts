import SQLite from 'better-sqlite3';


export const db: SQLite.Database = new SQLite(process.env.SQLITE_URL);
db.pragma('journal_mode = WAL');
