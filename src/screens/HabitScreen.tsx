import React, { useMemo } from "react";
import { Text, View } from "react-native";

import { ActivityGrid } from "../components/ActivityGrid";
import { TaskCard } from "../components/TaskCard";
import { styles } from "../styles";
import type { Habit, HabitTask } from "../types";

type HabitScreenProps = {
  habit: Habit;
  tasks: HabitTask[];
  calendarDays: Date[];
  todayKey: string;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (task: HabitTask) => void;
};

export function HabitScreen({
  habit,
  tasks,
  calendarDays,
  todayKey,
  onCompleteTask,
  onEditTask,
}: HabitScreenProps) {
  const dailyCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const task of tasks) {
      for (const date of task.completedDates) {
        counts[date] = (counts[date] ?? 0) + 1;
      }
    }

    return counts;
  }, [tasks]);

  const completionCount = useMemo(
    () => Object.values(dailyCounts).reduce((sum, count) => sum + count, 0),
    [dailyCounts]
  );

  return (
    <>
      <ActivityGrid
        calendarDays={calendarDays}
        dailyCounts={dailyCounts}
        baseColor={habit.color}
        title="Activity"
        subtitle={`${tasks.length} task${tasks.length === 1 ? "" : "s"} · ${completionCount} win${
          completionCount === 1 ? "" : "s"
        }`}
      />

      <View style={styles.sectionHeaderStack}>
        <Text style={styles.sectionTitle}>Tasks</Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Lets build a new habit!</Text>
          <Text style={styles.emptyText}>Add a task for this habit with the + button.</Text>
        </View>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            doneToday={task.completedDates.includes(todayKey)}
            onComplete={onCompleteTask}
            onEdit={onEditTask}
          />
        ))
      )}
    </>
  );
}
