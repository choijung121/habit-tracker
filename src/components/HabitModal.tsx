import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ColorPicker, { HueSlider, OpacitySlider, Panel1 } from "reanimated-color-picker";

import { DEFAULT_HABIT_COLOR } from "../constants";
import { styles } from "../styles";
import { toNormalizedHexColor } from "../utils/colors";

type HabitModalProps = {
  visible: boolean;
  habitName: string;
  category: string;
  color: string;
  categories: string[];
  taskNames: string;
  onChangeHabitName: (value: string) => void;
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
  category,
  color,
  categories,
  taskNames,
  onChangeHabitName,
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
  const [draftColor, setDraftColor] = useState(normalizedColor);
  const [draftHsla, setDraftHsla] = useState<string | null>(null);
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
    }
  }, [visible]);

  useEffect(() => {
    if (!isColorPickerOpen) {
      setDraftColor(normalizedColor);
      setDraftHsla(null);
    }
  }, [isColorPickerOpen, normalizedColor]);

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
    setDraftColor(normalizedColor);
    setDraftHsla(null);
  };

  const cancelColorPicker = () => {
    setIsColorPickerOpen(false);
    setDraftColor(normalizedColor);
    setDraftHsla(null);
  };

  const applyColorPicker = () => {
    onChangeColor(draftColor);
    setIsColorPickerOpen(false);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, (open || isColorPickerOpen) && styles.modalCardExpanded]}>
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

          <View style={[styles.dropdownField, styles.dropdownLayerTop]}>
            <Text style={styles.fieldLabel}>Category</Text>
            {open ? (
              <View style={styles.addCategoryPanel}>
                <Text style={styles.addCategoryHint}>
                  Pick an existing category below or add a new one here.
                </Text>
                <View style={styles.addOptionRow}>
                  <TextInput
                    style={[styles.input, styles.addOptionInput]}
                    value={newCategory}
                    onChangeText={setNewCategory}
                    placeholder="Add a new category"
                    placeholderTextColor="#8A957A"
                  />
                  <Pressable style={styles.addOptionButton} onPress={handleAddCategory}>
                    <Text style={styles.addOptionButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
            <DropDownPicker
              open={open}
              value={category || null}
              items={pickerItems}
              setOpen={setOpen}
              setValue={(callback) => {
                const currentValue = category || null;
                const nextValue = callback(currentValue);
                if (nextValue === category) {
                  onChangeCategory("");
                  return;
                }
                onChangeCategory(typeof nextValue === "string" ? nextValue : "");
              }}
              setItems={setPickerItems}
              placeholder="Select or add a category"
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

          <View style={styles.colorPickerField}>
            <Text style={styles.fieldLabel}>Color</Text>
            <View style={styles.colorPickerHeaderRow}>
              <View style={[styles.colorPreview, { backgroundColor: normalizedColor }]} />
              <Text style={styles.colorValueText}>{normalizedColor}</Text>
              <Pressable
                style={styles.colorPickerButton}
                onPress={isColorPickerOpen ? cancelColorPicker : openColorPicker}
              >
                <Text style={styles.colorPickerButtonText}>
                  {isColorPickerOpen ? "Close" : "Pick color"}
                </Text>
              </Pressable>
            </View>

            {!isColorPickerOpen ? (
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
                <Text style={styles.helperText}>Or tap “Pick color” for a custom shade.</Text>
              </View>
            ) : (
              <View style={styles.colorPickerPanel}>
                <ColorPicker
                  value={draftColor}
                  onChangeJS={(colors) => {
                    setDraftColor(colors.hex);
                    setDraftHsla(colors.hsla);
                  }}
                >
                  <Panel1 style={styles.colorPickerPanelSquare} />
                  <HueSlider style={styles.colorPickerSlider} />
                  <OpacitySlider style={styles.colorPickerSlider} />
                </ColorPicker>

                <Text style={styles.colorPickerReadout}>
                  {draftHsla ?? `hex(${draftColor})`}
                </Text>

                <View style={styles.modalFooterRow}>
                  <Pressable style={styles.secondaryAction} onPress={cancelColorPicker}>
                    <Text style={styles.secondaryActionText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.primaryActionSplit} onPress={applyColorPicker}>
                    <Text style={styles.primaryActionText}>Use color</Text>
                  </Pressable>
                </View>
              </View>
            )}
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
