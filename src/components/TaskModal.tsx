import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { styles } from "../styles";

type TaskModalProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  nameValue: string;
  typeValue: string;
  submitLabel: string;
  secondaryLabel: string;
  onChangeName: (value: string) => void;
  onChangeType: (value: string) => void;
  onSecondaryPress: () => void;
  onSubmit: () => void;
  onRequestClose: () => void;
};

export function TaskModal({
  visible,
  title,
  subtitle,
  nameValue,
  typeValue,
  submitLabel,
  secondaryLabel,
  onChangeName,
  onChangeType,
  onSecondaryPress,
  onSubmit,
  onRequestClose,
}: TaskModalProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>
          <TextInput
            style={styles.input}
            value={nameValue}
            onChangeText={onChangeName}
            placeholder="Task name"
            placeholderTextColor="#8A957A"
          />
          <TextInput
            style={styles.input}
            value={typeValue}
            onChangeText={onChangeType}
            placeholder="Task type"
            placeholderTextColor="#8A957A"
          />
          <View style={styles.modalActions}>
            <Pressable style={styles.secondaryAction} onPress={onSecondaryPress}>
              <Text style={styles.secondaryActionText}>{secondaryLabel}</Text>
            </Pressable>
            <Pressable style={styles.primaryAction} onPress={onSubmit}>
              <Text style={styles.primaryActionText}>{submitLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
