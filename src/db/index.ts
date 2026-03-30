import { INITIAL_HABITS, INITIAL_TASKS } from "../constants";
import type { Habit, HabitTask } from "../types";
import { toDateKey } from "../utils/habits";
import { getDb } from "./client";
import { createId } from "./ids";
import { migrate } from "./migrations";

function nowIso() {
  return new Date().toISOString();
}

export async function initializeDatabase() {
  const db = await getDb();
  await migrate(db);
  await seedIfEmpty();
}

async function seedIfEmpty() {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM habits WHERE archived_at IS NULL;"
  );
  if ((row?.count ?? 0) > 0) return;

  const createdAt = nowIso();

  await db.withTransactionAsync(async () => {
    for (const habit of INITIAL_HABITS) {
      await db.runAsync(
        `
          INSERT INTO habits (id, name, category, color, icon, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        habit.id,
        habit.name,
        habit.category,
        habit.color,
        habit.icon ?? "",
        createdAt,
        createdAt
      );
    }

    let sortOrder = 0;
    for (const task of INITIAL_TASKS) {
      await db.runAsync(
        `
          INSERT INTO tasks (id, habit_id, title, sort_order, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?);
        `,
        task.id,
        task.habitId,
        task.title,
        sortOrder,
        createdAt,
        createdAt
      );
      sortOrder += 1;
    }
  });
}

export async function getAllHabits(): Promise<Habit[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Habit>(
    `
      SELECT id, name, category, color, icon
      FROM habits
      WHERE archived_at IS NULL
      ORDER BY created_at DESC;
    `
  );
  return rows;
}

export async function getAllTasksWithCompletedDates(): Promise<HabitTask[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    title: string;
    habitId: string;
    completedDatesCsv: string | null;
  }>(
    `
      SELECT
        t.id as id,
        t.title as title,
        t.habit_id as habitId,
        GROUP_CONCAT(a.date_key, ',') as completedDatesCsv
      FROM tasks t
      LEFT JOIN activities a
        ON a.task_id = t.id
        AND a.archived_at IS NULL
      WHERE t.archived_at IS NULL
      GROUP BY t.id
      ORDER BY t.created_at DESC;
    `
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    habitId: row.habitId,
    completedDates: row.completedDatesCsv ? row.completedDatesCsv.split(",").filter(Boolean) : [],
  }));
}

export async function createHabitWithSeedTasks(input: {
  name: string;
  category: string;
  color: string;
  icon: string;
  taskTitles: string[];
}): Promise<{ habitId: string }> {
  const db = await getDb();
  const habitId = createId("habit");
  const createdAt = nowIso();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
        INSERT INTO habits (id, name, category, color, icon, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      habitId,
      input.name,
      input.category,
      input.color,
      input.icon,
      createdAt,
      createdAt
    );

    let sortOrder = 0;
    for (const title of input.taskTitles) {
      const taskId = createId("task");
      await db.runAsync(
        `
          INSERT INTO tasks (id, habit_id, title, sort_order, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?);
        `,
        taskId,
        habitId,
        title,
        sortOrder,
        createdAt,
        createdAt
      );
      sortOrder += 1;
    }
  });

  return { habitId };
}

export async function createTask(input: { habitId: string; title: string }) {
  const db = await getDb();
  const taskId = createId("task");
  const createdAt = nowIso();

  await db.runAsync(
    `
      INSERT INTO tasks (id, habit_id, title, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    taskId,
    input.habitId,
    input.title,
    0,
    createdAt,
    createdAt
  );

  return { taskId };
}

export async function updateTask(input: { taskId: string; title: string; habitId: string }) {
  const db = await getDb();
  await db.runAsync(
    `
      UPDATE tasks
      SET title = ?, habit_id = ?, updated_at = ?
      WHERE id = ?;
    `,
    input.title,
    input.habitId,
    nowIso(),
    input.taskId
  );
}

export async function archiveTask(taskId: string) {
  const db = await getDb();
  const archivedAt = nowIso();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
        UPDATE tasks
        SET archived_at = ?, updated_at = ?
        WHERE id = ?;
      `,
      archivedAt,
      archivedAt,
      taskId
    );

    await db.runAsync(
      `
        UPDATE activities
        SET archived_at = ?, updated_at = ?
        WHERE task_id = ? AND archived_at IS NULL;
      `,
      archivedAt,
      archivedAt,
      taskId
    );
  });
}

export async function toggleTaskCompletion(taskId: string, dateKey?: string) {
  const db = await getDb();
  const resolvedDateKey = dateKey ?? toDateKey(new Date());
  const timestamp = nowIso();

  await db.withTransactionAsync(async () => {
    const existing = await db.getFirstAsync<{ id: string; archived_at: string | null }>(
      `
        SELECT id, archived_at
        FROM activities
        WHERE task_id = ? AND date_key = ?
        LIMIT 1;
      `,
      taskId,
      resolvedDateKey
    );

    if (existing?.id && !existing.archived_at) {
      await db.runAsync(
        `
          UPDATE activities
          SET archived_at = ?, updated_at = ?
          WHERE id = ?;
        `,
        timestamp,
        timestamp,
        existing.id
      );
      return;
    }

    if (existing?.id && existing.archived_at) {
      await db.runAsync(
        `
          UPDATE activities
          SET archived_at = NULL, updated_at = ?
          WHERE id = ?;
        `,
        timestamp,
        existing.id
      );
      return;
    }

    await db.runAsync(
      `
        INSERT INTO activities (id, task_id, date_key, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?);
      `,
      createId("activity"),
      taskId,
      resolvedDateKey,
      timestamp,
      timestamp
    );
  });
}
