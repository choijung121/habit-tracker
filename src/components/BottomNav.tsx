import { Pressable, Text, View } from "react-native";

import { NAV_ITEMS } from "../constants";
import { styles } from "../styles";
import type { TabKey } from "../types";

type BottomNavProps = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => {
        const active = item.key === activeTab;

        return (
          <Pressable
            key={item.key}
            style={[styles.navItem, active && styles.navItemActive]}
            onPress={() => onChange(item.key)}
          >
            <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
