import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

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
  onSelectHabit: (habitId: string | null) => void;
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
  const [open, setOpen] = useState(false);
  const items = useMemo(
    () =>
      habits.map((habit) => ({
        label: `${habit.name} · ${habit.category}`,
        value: habit.id,
      })),
    [habits]
  );
  const [pickerItems, setPickerItems] = useState(items);

  useEffect(() => {
    setPickerItems(items);
  }, [items]);

  useEffect(() => {
    if (!visible) {
      setOpen(false);
    }
  }, [visible]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, open && styles.modalCardExpanded]}>
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
            {habits.length === 0 ? (
              <Text style={styles.helperText}>Add a habit first, then link tasks to it here.</Text>
            ) : (
              <View style={styles.dropdownLayerTop}>
                <DropDownPicker
                  open={open}
                  value={selectedHabitId}
                  items={pickerItems}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    const nextValue = callback(selectedHabitId);
                    if (nextValue === selectedHabitId) {
                      onSelectHabit(null);
                      return;
                    }
                    onSelectHabit(typeof nextValue === "string" ? nextValue : null);
                  }}
                  setItems={setPickerItems}
                  placeholder="Select a habit"
                  listMode="SCROLLVIEW"
                  style={styles.dropdownPicker}
                  dropDownContainerStyle={styles.dropdownPickerContainer}
                  textStyle={styles.dropdownPickerText}
                  placeholderStyle={styles.dropdownPickerPlaceholder}
                  ArrowDownIconComponent={() => <Text style={styles.dropdownChevron}>⌄</Text>}
                  ArrowUpIconComponent={() => <Text style={styles.dropdownChevron}>⌃</Text>}
                  zIndex={3000}
                  zIndexInverse={1000}
                />
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
