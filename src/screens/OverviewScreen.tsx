import React from "react";
import { Text, View } from "react-native";

import { PageHeader } from "../components/PageHeader";
import { styles } from "../styles";
import type { Habit, HabitTask } from "../types";

type OverviewScreenProps = {
  habits: Habit[];
  tasks: HabitTask[];
  completedToday: number;
  totalCompletions: number;
  topCategories: Array<[string, number]>;
};

export function OverviewScreen({
  habits,
  tasks,
  completedToday,
  totalCompletions,
  topCategories,
}: OverviewScreenProps) {
  return (
    <>
      <PageHeader
        eyebrow="Habit Tracker"
        title="Overview"
        subtitle="Use this home tab for quick progress, category coverage, and your active habits."
      />

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Overview is the extra tab I recommend.</Text>
        <Text style={styles.heroSubtitle}>
          It gives you a fast snapshot before you jump into detailed activity or task management.
        </Text>

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
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Top category</Text>
          <Text style={styles.summaryValue}>{topCategories[0]?.[0] ?? "None"}</Text>
          <Text style={styles.summaryAccent}>
            {topCategories[0]?.[1] ?? 0} completions so far
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total wins</Text>
          <Text style={styles.summaryValue}>{totalCompletions}</Text>
          <Text style={styles.summaryAccent}>Across all habits and categories</Text>
        </View>
      </View>

      <View style={styles.sectionHeaderStack}>
        <Text style={styles.sectionTitle}>Habits by category</Text>
        <Text style={styles.sectionSubtitle}>
          Exercise, diet, reading, and anything else you add
        </Text>
      </View>

      {habits.map((habit) => {
        const habitTaskCount = tasks.filter((task) => task.habitId === habit.id).length;

        return (
          <View key={habit.id} style={styles.habitRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{habit.category}</Text>
            </View>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.helperText}>
              {habitTaskCount} linked task{habitTaskCount === 1 ? "" : "s"}
            </Text>
          </View>
        );
      })}
    </>
  );
}

