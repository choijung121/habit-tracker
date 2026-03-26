import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type RadioButtonProps = {
  label?: string;
  selected: boolean;
  onPress: () => void;
};

export function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.radioButtonContainer,
        pressed && styles.radioButtonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={[styles.radioButtonOuter, selected && styles.radioButtonSelected]}>
        {selected && <View style={styles.radioButtonInner} />}
      </View>
      {label ? <Text style={styles.radioButtonLabel}>{label}</Text> : null}
    </Pressable>
  );
}
