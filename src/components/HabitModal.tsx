import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { DEFAULT_HABIT_COLOR } from "../constants";
import { HabitColorPickerModal } from "./HabitColorPickerModal";
import { styles } from "../styles";
import { toNormalizedHexColor } from "../utils/colors";

type HabitModalProps = {
  visible: boolean;
  habitName: string;
  icon: string;
  category: string;
  color: string;
  categories: string[];
  taskNames: string;
  onChangeHabitName: (value: string) => void;
  onChangeIcon: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeColor: (value: string) => void;
  onAddCategory: (value: string) => void;
  onChangeTaskNames: (value: string) => void;
  onSubmit: () => void;
  onRequestClose: () => void;
};

export function HabitModal({
  visible,
  habitName,
  icon,
  category,
  color,
  categories,
  taskNames,
  onChangeHabitName,
  onChangeIcon,
  onChangeCategory,
  onChangeColor,
  onAddCategory,
  onChangeTaskNames,
  onSubmit,
  onRequestClose,
}: HabitModalProps) {
  const [open, setOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [emojiDraft, setEmojiDraft] = useState("");
  const emojiInputRef = useRef<TextInput | null>(null);
  const items = useMemo(
    () =>
      categories.map((option) => ({
        label: option,
        value: option,
      })),
    [categories]
  );
  const [pickerItems, setPickerItems] = useState(items);
  const normalizedColor = toNormalizedHexColor(color) ?? DEFAULT_HABIT_COLOR;
  const colorOptions = useMemo(
    () => [
      "#2D5B22",
      "#16A34A",
      "#0EA5A4",
      "#1D4ED8",
      "#7C3AED",
      "#B3261E",
      "#F97316",
    ],
    []
  );

  useEffect(() => {
    setPickerItems(items);
  }, [items]);

  useEffect(() => {
    if (!visible) {
      setOpen(false);
      setIsColorPickerOpen(false);
      setNewCategory("");
      setEmojiDraft("");
      Keyboard.dismiss();
    }
  }, [visible]);

  const handleAddCategory = () => {
    const value = newCategory.trim();
    if (!value) return;

    onAddCategory(value);
    setNewCategory("");
    setOpen(false);
  };

  const openColorPicker = () => {
    setOpen(false);
    setIsColorPickerOpen(true);
  };

  const cancelColorPicker = () => {
    setIsColorPickerOpen(false);
  };

  const applyColorPicker = (nextColor: string) => {
    onChangeColor(nextColor);
    setIsColorPickerOpen(false);
  };

  const focusEmojiKeyboard = () => {
    setOpen(false);
    emojiInputRef.current?.focus();
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="fullScreen"
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={styles.modalFullScreen}>
        <View style={styles.modalTopBar}>
          <Pressable style={styles.modalTopIconButton} onPress={onRequestClose}>
            <Text style={styles.modalTopIconText}>X</Text>
          </Pressable>
          <Text style={styles.modalTopTitle}>Add Habit</Text>
          <Pressable style={styles.modalTopIconButton} onPress={onSubmit}>
            <Text style={styles.modalTopIconText}>✓</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.modalLeadText}>
            Create a habit category and optionally seed it with tasks.
          </Text>

          <View style={styles.modalSectionCard}>
            <View style={styles.habitNameRow}>
              <Pressable
                style={styles.habitIconButton}
                onPress={focusEmojiKeyboard}
                accessibilityRole="button"
                accessibilityLabel="Choose habit icon"
              >
                <Text style={styles.habitIconText}>{icon || "🙂"}</Text>
              </Pressable>

              <TextInput
                ref={emojiInputRef}
                style={styles.hiddenEmojiInput}
                value={emojiDraft}
                onChangeText={(value) => {
                  setEmojiDraft(value);
                  const next = value.trim();
                  if (!next) return;

                  onChangeIcon(next);
                  setEmojiDraft("");
                  emojiInputRef.current?.blur();
                }}
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={12}
                blurOnSubmit
                onSubmitEditing={() => {
                  setEmojiDraft("");
                  emojiInputRef.current?.blur();
                }}
              />

              <TextInput
                style={[styles.input, styles.habitNameInput]}
                value={habitName}
                onChangeText={onChangeHabitName}
                placeholder="Habit name"
                placeholderTextColor="#8A957A"
              />
            </View>

            <View style={styles.colorPickerField}>
              <Text style={styles.fieldLabel}>Color</Text>
              <View style={styles.colorPickerHeaderRow}>
                <View style={[styles.colorPreview, { backgroundColor: normalizedColor }]} />
                <Text style={styles.colorValueText}>{normalizedColor}</Text>
                <Pressable style={styles.colorPickerButton} onPress={openColorPicker}>
                  <Text style={styles.colorPickerButtonText}>Pick color</Text>
                </Pressable>
              </View>

              <View style={styles.colorPickerRow}>
                {colorOptions.map((option) => {
                  const isSelected = option.toUpperCase() === normalizedColor.toUpperCase();
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      accessibilityLabel={`Select color ${option}`}
                      onPress={() => onChangeColor(option)}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: option },
                        isSelected && styles.colorSwatchSelected,
                      ]}
                    />
                  );
                })}
                <Text style={styles.helperText}>Use a swatch or pick a custom shade.</Text>
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
        </ScrollView>
      </SafeAreaView>

      <HabitColorPickerModal
        visible={isColorPickerOpen}
        color={normalizedColor}
        onCancel={cancelColorPicker}
        onSubmit={applyColorPicker}
      />
    </Modal>
  );
}
