import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import ColorPicker, { HueSlider, OpacitySlider, Panel1 } from "reanimated-color-picker";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { DEFAULT_HABIT_COLOR } from "../constants";
import { styles } from "../styles";
import { toNormalizedHexColor } from "../utils/colors";

import type { RenderThumbProps } from "reanimated-color-picker";

type HabitColorPickerModalProps = {
  visible: boolean;
  color: string;
  onCancel: () => void;
  onSubmit: (nextColor: string) => void;
};

function PickerThumb({ positionStyle, width, height, currentColor, adaptiveColor }: RenderThumbProps) {
  const ringStyle = useAnimatedStyle(() => ({ borderColor: adaptiveColor.value }), [adaptiveColor]);
  const fillStyle = useAnimatedStyle(() => ({ backgroundColor: currentColor.value }), [currentColor]);
  const innerSize = Math.max(10, Math.round(width * 0.62));
  const innerOffset = Math.round((width - innerSize) / 2);

  return (
    <Animated.View style={[positionStyle, { width, height }]}>
      <Animated.View
        style={[
          styles.colorPickerThumbRing,
          { width, height, borderRadius: width / 2 },
          ringStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.colorPickerThumbFill,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            left: innerOffset,
            top: innerOffset,
          },
          fillStyle,
        ]}
      />
    </Animated.View>
  );
}

export function HabitColorPickerModal({
  visible,
  color,
  onCancel,
  onSubmit,
}: HabitColorPickerModalProps) {
  const normalizedColor = useMemo(
    () => toNormalizedHexColor(color) ?? DEFAULT_HABIT_COLOR,
    [color]
  );

  const [draftColor, setDraftColor] = useState(normalizedColor);
  const [draftHsla, setDraftHsla] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setDraftColor(normalizedColor);
      setDraftHsla(null);
    }
  }, [normalizedColor, visible]);

  const apply = () => {
    onSubmit(draftColor);
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, styles.colorPickerModalCard]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>Pick a color</Text>
              <Text style={styles.modalSubtitle}>
                Choose a custom shade for your habit’s activity grid.
              </Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onCancel}>
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
          </View>

          <View style={styles.colorPickerPanel}>
            <ColorPicker
              value={draftColor}
              onChangeJS={(colors) => {
                setDraftColor(colors.hex);
                setDraftHsla(colors.hsla);
              }}
              renderThumb={PickerThumb}
            >
              <Panel1 style={styles.colorPickerPanelSquare} />
              <HueSlider style={styles.colorPickerSlider} sliderThickness={18} adaptSpectrum={false} />
              {/* <OpacitySlider style={styles.colorPickerSlider} sliderThickness={18} /> */}
            </ColorPicker>
            <Text style={styles.colorPickerReadout}>{draftHsla ?? `hex(${draftColor})`}</Text>
          </View>

          <View style={styles.modalFooterRow}>
            <Pressable style={styles.secondaryAction} onPress={onCancel}>
              <Text style={styles.secondaryActionText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.primaryActionSplit} onPress={apply}>
              <Text style={styles.primaryActionText}>Use color</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
