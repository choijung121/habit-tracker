import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type HeroCardProps = {
  taskCount: number;
  completedToday: number;
  totalCompletions: number;
  onAddPress: () => void;
};

export function HeroCard({
  taskCount,
  completedToday,
  totalCompletions,
  onAddPress,
}: HeroCardProps) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroTopRow}>
        <View>
          <Text style={styles.eyebrow}>Habit Tracker</Text>
          <Text style={styles.heroTitle}>Consistency compounds.</Text>
        </View>
        <Pressable style={styles.plusButton} onPress={onAddPress}>
          <Text style={styles.plusButtonText}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.heroSubtitle}>
        Complete your habits to darken the grid, just like GitHub contributions.
      </Text>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{taskCount}</Text>
          <Text style={styles.statLabel}>Active tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedToday}</Text>
          <Text style={styles.statLabel}>Done today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalCompletions}</Text>
          <Text style={styles.statLabel}>Total wins</Text>
        </View>
      </View>
    </View>
  );
}
