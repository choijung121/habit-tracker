import React, { useMemo } from "react";

import { ActivityGrid } from "../components/ActivityGrid";
import { PageHeader } from "../components/PageHeader";
import type { Habit, HabitTask } from "../types";

type ActivityScreenProps = {
  habits: Habit[];
  tasks: HabitTask[];
  calendarDays: Date[];
};

export function ActivityScreen({ habits, tasks, calendarDays }: ActivityScreenProps) {
  const habitActivity = useMemo(() => {
    return habits.map((habit) => {
      const habitTasks = tasks.filter((task) => task.habitId === habit.id);
      const counts: Record<string, number> = {};

      for (const task of habitTasks) {
        for (const date of task.completedDates) {
          counts[date] = (counts[date] ?? 0) + 1;
        }
      }

      return {
        habit,
        dailyCounts: counts,
        taskCount: habitTasks.length,
        completionCount: Object.values(counts).reduce((sum, count) => sum + count, 0),
      };
    });
  }, [habits, tasks]);

  return (
    <>
      <PageHeader
        eyebrow="All Habits"
        title="Activity Grid"
        subtitle="Each habit has its own contribution grid, so Diet, Exercise, Reading, and new habits all stay separate."
      />

      {habitActivity.map(({ habit, dailyCounts, taskCount, completionCount }) => (
        <ActivityGrid
          key={habit.id}
          calendarDays={calendarDays}
          dailyCounts={dailyCounts}
          title={habit.name}
          subtitle={`${habit.category} · ${taskCount} task${taskCount === 1 ? "" : "s"} · ${completionCount} completion${completionCount === 1 ? "" : "s"}`}
        />
      ))}
    </>
  );
}
