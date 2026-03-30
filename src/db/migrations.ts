import type * as SQLite from "expo-sqlite";

type Migration = {
  version: number;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

const migrations: Migration[] = [
  {
    version: 1,
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS habits (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          color TEXT NOT NULL,
          icon TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          archived_at TEXT
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY NOT NULL,
          habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          archived_at TEXT
        );

        CREATE TABLE IF NOT EXISTS activities (
          id TEXT PRIMARY KEY NOT NULL,
          task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
          date_key TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          archived_at TEXT,
          UNIQUE(task_id, date_key)
        );

        CREATE INDEX IF NOT EXISTS idx_tasks_habit_id ON tasks(habit_id);
        CREATE INDEX IF NOT EXISTS idx_activities_task_id ON activities(task_id);
        CREATE INDEX IF NOT EXISTS idx_activities_date_key ON activities(date_key);
      `);
    },
  },
];

export async function migrate(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version;");
  const currentVersion = row?.user_version ?? 0;

  for (const migration of migrations) {
    if (migration.version <= currentVersion) continue;
    await migration.up(db);
    await db.execAsync(`PRAGMA user_version = ${migration.version};`);
  }
}

