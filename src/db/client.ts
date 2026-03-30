import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("habit-tracker.db");
      await db.execAsync("PRAGMA foreign_keys = ON;");
      return db;
    })();
  }

  return dbPromise;
}

