import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { CATEGORY_OPTIONS } from "../constants";
import { styles } from "../styles";

type HabitModalProps = {
  visible: boolean;
  habitName: string;
  category: string;
  taskNames: string;
  onChangeHabitName: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeTaskNames: (value: string) => void;
  onSubmit: () => void;
  onRequestClose: () => void;
};

export function HabitModal({
  visible,
  habitName,
  category,
  taskNames,
  onChangeHabitName,
  onChangeCategory,
  onChangeTaskNames,
  onSubmit,
  onRequestClose,
}: HabitModalProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>Add Habit</Text>
              <Text style={styles.modalSubtitle}>
                Create a habit category and optionally seed it with tasks.
              </Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onRequestClose}>
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            value={habitName}
            onChangeText={onChangeHabitName}
            placeholder="Habit name"
            placeholderTextColor="#8A957A"
          />

          <View style={styles.optionGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={onChangeCategory}
              placeholder="Category name"
              placeholderTextColor="#8A957A"
            />
            <View style={styles.optionRow}>
              {CATEGORY_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionChip,
                    category === option && styles.optionChipActive,
                  ]}
                  onPress={() => onChangeCategory(option)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      category === option && styles.optionChipTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={taskNames}
            onChangeText={onChangeTaskNames}
            placeholder="Add tasks separated by commas"
            placeholderTextColor="#8A957A"
            multiline
          />

          <Pressable style={styles.primaryActionFull} onPress={onSubmit}>
            <Text style={styles.primaryActionText}>Save Habit</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
