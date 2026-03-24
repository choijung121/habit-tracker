import React from "react";
import { Pressable, Text, View } from "react-native";

import { ActivityGrid } from "../components/ActivityGrid";
import { PageHeader } from "../components/PageHeader";
import { DEFAULT_HABIT_COLOR } from "../constants";
import { styles } from "../styles";
import type { Habit, HabitTask } from "../types";

type OverviewScreenProps = {
  habits: Habit[];
  tasks: HabitTask[];
  calendarDays: Date[];
  dailyCounts: Record<string, number>;
  completedToday: number;
  totalCompletions: number;
  onSelectHabit: (habitId: string) => void;
};

export function OverviewScreen({
  habits,
  tasks,
  calendarDays,
  dailyCounts,
  completedToday,
  totalCompletions,
  onSelectHabit,
}: OverviewScreenProps) {
  return (
    <>
      <PageHeader
        title="Overview"
      />

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{habits.length}</Text>
          <Text style={styles.statLabel}>Habits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedToday}</Text>
          <Text style={styles.statLabel}>Done today</Text>
        </View>
      </View>

      <ActivityGrid
        calendarDays={calendarDays}
        dailyCounts={dailyCounts}
        baseColor={DEFAULT_HABIT_COLOR}
        title="All activity"
        subtitle={`${totalCompletions} total win${totalCompletions === 1 ? "" : "s"} · Last 52 weeks`}
      />

      <View style={styles.sectionHeaderStack}>
        <Text style={styles.sectionTitle}>My Habits</Text>
      </View>

      {habits.map((habit) => {
        const habitTaskCount = tasks.filter((task) => task.habitId === habit.id).length;

        return (
          <Pressable
            key={habit.id}
            style={({ pressed }) => [
              styles.habitRow,
              styles.habitRowPressable,
              pressed && styles.habitRowPressed,
            ]}
            onPress={() => onSelectHabit(habit.id)}
          >
            <Text style={styles.habitName}>
              {habit.icon ? `${habit.icon} ` : ""}
              {habit.name}
            </Text>
            <Text style={styles.helperText}>
              {habitTaskCount} linked task{habitTaskCount === 1 ? "" : "s"}
            </Text>
          </Pressable>
        );
      })}
    </>
  );
}
