import { Pressable, Text, View } from "react-native";

import type { HabitTask } from "../types";
import { styles } from "../styles";
import { RadioButton } from "./RadioButton";

type TaskCardProps = {
  task: HabitTask;
  doneToday: boolean;
  onComplete: (taskId: string) => void;
  onEdit: (task: HabitTask) => void;
};

export function TaskCard({
  task,
  doneToday,
  onComplete,
  onEdit,
}: TaskCardProps) {
  return (
    <View style={styles.taskCard}>
      <RadioButton
        selected={doneToday}
        onPress={() => onComplete(task.id)}
      />

      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskMeta}>
          {task.completedDates.length} completion{task.completedDates.length === 1 ? "" : "s"}
        </Text>
      </View>

      <Pressable style={styles.ellipsisButton} onPress={() => onEdit(task)}>
        <Text style={styles.ellipsisText}>...</Text>
      </Pressable>
    </View>
  );
}
