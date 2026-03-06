import { Pressable, Text, View } from "react-native";

import type { HabitTask } from "../types";
import { styles } from "../styles";

type TaskCardProps = {
  task: HabitTask;
  doneToday: boolean;
  onComplete: (taskId: string) => void;
  onEdit: (task: HabitTask) => void;
};

export function TaskCard({ task, doneToday, onComplete, onEdit }: TaskCardProps) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskInfo}>
        <View style={styles.taskTypeBadge}>
          <Text style={styles.taskTypeText}>{task.type}</Text>
        </View>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskMeta}>
          {task.completedDates.length} completion{task.completedDates.length === 1 ? "" : "s"}
        </Text>
      </View>

      <View style={styles.taskActions}>
        <Pressable
          style={[styles.completeButton, doneToday && styles.completeButtonDone]}
          onPress={() => onComplete(task.id)}
        >
          <Text
            style={[
              styles.completeButtonText,
              doneToday && styles.completeButtonTextDone,
            ]}
          >
            {doneToday ? "Done" : "Complete"}
          </Text>
        </Pressable>
        <Pressable style={styles.ellipsisButton} onPress={() => onEdit(task)}>
          <Text style={styles.ellipsisText}>...</Text>
        </Pressable>
      </View>
    </View>
  );
}
