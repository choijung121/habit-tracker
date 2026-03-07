import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { styles } from "../styles";
import type { Habit } from "../types";

type TaskModalProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  nameValue: string;
  selectedHabitId: string | null;
  habits: Habit[];
  submitLabel: string;
  secondaryLabel?: string;
  onChangeName: (value: string) => void;
  onSelectHabit: (habitId: string) => void;
  onSecondaryPress?: () => void;
  onSubmit: () => void;
  onRequestClose: () => void;
};

export function TaskModal({
  visible,
  title,
  subtitle,
  nameValue,
  selectedHabitId,
  habits,
  submitLabel,
  secondaryLabel,
  onChangeName,
  onSelectHabit,
  onSecondaryPress,
  onSubmit,
  onRequestClose,
}: TaskModalProps) {
  const selectedHabit = habits.find((habit) => habit.id === selectedHabitId);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalSubtitle}>{subtitle}</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onRequestClose}>
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            value={nameValue}
            onChangeText={onChangeName}
            placeholder="Task name"
            placeholderTextColor="#8A957A"
          />

          <View style={styles.dropdownField}>
            <Text style={styles.fieldLabel}>Linked habit</Text>
            <View style={styles.dropdownValue}>
              <Text style={styles.dropdownValueText}>
                {selectedHabit ? `${selectedHabit.name} · ${selectedHabit.category}` : "Select a habit"}
              </Text>
            </View>
            {habits.length === 0 ? (
              <Text style={styles.helperText}>Add a habit first, then link tasks to it here.</Text>
            ) : (
              <View style={styles.dropdownOptions}>
                {habits.map((habit) => (
                  <Pressable
                    key={habit.id}
                    style={[
                      styles.dropdownOption,
                      selectedHabitId === habit.id && styles.dropdownOptionActive,
                    ]}
                    onPress={() => onSelectHabit(habit.id)}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        selectedHabitId === habit.id && styles.dropdownOptionTextActive,
                      ]}
                    >
                      {habit.name} · {habit.category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {secondaryLabel && onSecondaryPress ? (
            <View style={styles.modalFooterRow}>
              <Pressable style={styles.secondaryAction} onPress={onSecondaryPress}>
                <Text style={styles.secondaryActionText}>{secondaryLabel}</Text>
              </Pressable>
              <Pressable style={styles.primaryActionSplit} onPress={onSubmit}>
                <Text style={styles.primaryActionText}>{submitLabel}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.primaryActionFull} onPress={onSubmit}>
              <Text style={styles.primaryActionText}>{submitLabel}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
