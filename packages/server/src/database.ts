import SQLite from 'better-sqlite3';


export const db: SQLite.Database = new SQLite('./database/main.db');
db.pragma('journal_mode = WAL');
