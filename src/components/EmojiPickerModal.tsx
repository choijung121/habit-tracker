import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { styles } from "../styles";

const DEFAULT_EMOJIS = [
  "🏃‍♂️",
  "🏋️‍♀️",
  "🚴‍♂️",
  "🧘‍♀️",
  "🥗",
  "🍎",
  "💧",
  "📚",
  "🧠",
  "📝",
  "🎨",
  "🎧",
  "🧹",
  "🛌",
  "🌙",
  "☀️",
  "🧑‍💻",
  "🧑‍🍳",
  "🧗‍♀️",
  "🪴",
];

type EmojiPickerModalProps = {
  visible: boolean;
  value: string;
  onSelect: (emoji: string) => void;
  onRequestClose: () => void;
};

export function EmojiPickerModal({
  visible,
  value,
  onSelect,
  onRequestClose,
}: EmojiPickerModalProps) {
  const [query, setQuery] = useState("");

  const emojis = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return DEFAULT_EMOJIS;

    // Simple filter: allow typing an emoji or a substring of the emoji itself.
    return DEFAULT_EMOJIS.filter((emoji) => emoji.includes(trimmed));
  }, [query]);

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
          <Text style={styles.modalTopTitle}>Choose Icon</Text>
          <View style={styles.modalTopIconButton} />
        </View>

        <ScrollView
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.modalLeadText}>
            Tap an emoji to use it as your habit icon.
          </Text>

          <View style={styles.modalSectionCard}>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Filter (optional)"
              placeholderTextColor="#8A957A"
            />

            <View style={styles.emojiGrid}>
              {emojis.map((emoji) => {
                const selected = emoji === value;
                return (
                  <Pressable
                    key={emoji}
                    style={[styles.emojiCell, selected && styles.emojiCellSelected]}
                    onPress={() => onSelect(emoji)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select icon ${emoji}`}
                  >
                    <Text style={styles.emojiCellText}>{emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

