import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  backLabel?: string;
};

export function PageHeader({ title, onBack, backLabel = "Back" }: PageHeaderProps) {
  return (
    <View style={styles.pageHeader}>
      {onBack ? (
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
        >
          <Text style={styles.backButtonText}>‹</Text>
          <Text style={styles.backButtonLabel} numberOfLines={1}>
            {backLabel}
          </Text>
        </Pressable>
      ) : null}

      <Text style={styles.pageTitle}>{title}</Text>
    </View>
  );
}
