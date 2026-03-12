import React, { useMemo } from "react";
import { Text, View } from "react-native";

import { PageHeader } from "../components/PageHeader";
import { TaskCard } from "../components/TaskCard";
import { styles } from "../styles";
import type { Habit, HabitTask } from "../types";

type TasksScreenProps = {
  habits: Habit[];
  tasks: HabitTask[];
  todayKey: string;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (task: HabitTask) => void;
};

export function TasksScreen({
  habits,
  tasks,
  todayKey,
  onCompleteTask,
  onEditTask,
}: TasksScreenProps) {
  const habitMap = useMemo(() => {
    return habits.reduce<Record<string, Habit>>((acc, habit) => {
      acc[habit.id] = habit;
      return acc;
    }, {});
  }, [habits]);

  const tasksByCategory = useMemo(() => {
    const groups: Record<string, HabitTask[]> = {};

    for (const task of tasks) {
      const category = habitMap[task.habitId]?.category ?? "Unassigned";
      if (!groups[category]) groups[category] = [];
      groups[category].push(task);
    }

    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [habitMap, tasks]);

  return (
    <>
      <PageHeader
        eyebrow="Manage"
        title="Tasks"
        subtitle="Browse tasks grouped by category and mark them complete from here."
      />

      {tasksByCategory.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No tasks yet</Text>
          <Text style={styles.emptyText}>
            Use the floating + button to add a habit or create a task linked to an existing habit.
          </Text>
        </View>
      ) : (
        tasksByCategory.map(([category, categoryTasks]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{category}</Text>
              </View>
              <Text style={styles.categoryCount}>{categoryTasks.length} tasks</Text>
            </View>

            {categoryTasks.map((task) => {
              const habit = habitMap[task.habitId];

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  habitName={habit?.name ?? "Unassigned habit"}
                  category={habit?.category ?? "Unassigned"}
                  doneToday={task.completedDates.includes(todayKey)}
                  onComplete={onCompleteTask}
                  onEdit={onEditTask}
                />
              );
            })}
          </View>
        ))
      )}
    </>
  );
}

