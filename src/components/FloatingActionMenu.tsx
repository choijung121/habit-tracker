import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type FloatingActionMenuProps = {
  open: boolean;
  onToggle: () => void;
  onAddHabit: () => void;
  onAddTask: () => void;
};

export function FloatingActionMenu({
  open,
  onToggle,
  onAddHabit,
  onAddTask,
}: FloatingActionMenuProps) {
  return (
    <View style={styles.fabWrapper}>
      {open ? (
        <View style={styles.fabMenu}>
          <Pressable style={styles.fabMenuItem} onPress={onAddHabit}>
            <Text style={styles.fabMenuLabel}>Add Habit</Text>
          </Pressable>
          <Pressable style={styles.fabMenuItem} onPress={onAddTask}>
            <Text style={styles.fabMenuLabel}>Add Task</Text>
          </Pressable>
        </View>
      ) : null}
      <Pressable style={styles.fabButton} onPress={onToggle}>
        <Text style={styles.fabButtonText}>{open ? "x" : "+"}</Text>
      </Pressable>
    </View>
  );
}
