import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type FloatingActionMenuMenuProps = {
  variant?: "menu";
  open: boolean;
  onToggle: () => void;
  onAddHabit: () => void;
  onAddTask: () => void;
};

type FloatingActionMenuQuickAddTaskProps = {
  variant: "quickAddTask";
  onAddTask: () => void;
};

type FloatingActionMenuProps = FloatingActionMenuMenuProps | FloatingActionMenuQuickAddTaskProps;

export function FloatingActionMenu(props: FloatingActionMenuProps) {
  if (props.variant === "quickAddTask") {
    return (
      <View style={styles.fabWrapper}>
        <Pressable style={styles.fabButton} onPress={props.onAddTask}>
          <Text style={styles.fabButtonText}>+</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.fabWrapper}>
      {props.open ? (
        <View style={styles.fabMenu}>
          <Pressable style={styles.fabMenuItem} onPress={props.onAddHabit}>
            <Text style={styles.fabMenuLabel}>Add Habit</Text>
          </Pressable>
          <Pressable style={styles.fabMenuItem} onPress={props.onAddTask}>
            <Text style={styles.fabMenuLabel}>Add Task</Text>
          </Pressable>
        </View>
      ) : null}
      <Pressable style={styles.fabButton} onPress={props.onToggle}>
        <Text style={styles.fabButtonText}>{props.open ? "x" : "+"}</Text>
      </Pressable>
    </View>
  );
}
