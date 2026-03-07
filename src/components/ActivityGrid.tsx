import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { DAY_LABELS, GRID_WEEKS, SHADE_SCALE } from "../constants";
import { styles } from "../styles";
import { getShadeColor, toDateKey } from "../utils/habits";

type ActivityGridProps = {
  calendarDays: Date[];
  dailyCounts: Record<string, number>;
  title?: string;
  subtitle?: string;
};

export function ActivityGrid({
  calendarDays,
  dailyCounts,
  title = "Activity",
  subtitle = `Last ${GRID_WEEKS} weeks`,
}: ActivityGridProps) {
  const weekColumns = useMemo(() => {
    const columns: Date[][] = [];

    for (let week = 0; week < GRID_WEEKS; week += 1) {
      columns.push(calendarDays.slice(week * 7, week * 7 + 7));
    }

    return columns;
  }, [calendarDays]);

  const monthLabels = useMemo(() => {
    return weekColumns.map((week) =>
      week[0].toLocaleString("en-US", { month: "short" })
    );
  }, [weekColumns]);

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.legend}>
          <Text style={styles.legendText}>Less</Text>
          {SHADE_SCALE.map((color) => (
            <View key={color} style={[styles.legendSwatch, { backgroundColor: color }]} />
          ))}
          <Text style={styles.legendText}>More</Text>
        </View>
      </View>

      <View style={styles.calendarShell}>
        <View style={styles.monthRow}>
          {monthLabels.map((label, index) => (
            <Text key={`${label}-${index}`} style={styles.monthLabel}>
              {index > 0 && monthLabels[index - 1] === label ? "" : label}
            </Text>
          ))}
        </View>
        <View style={styles.calendarRow}>
          <View style={styles.dayLabels}>
            {DAY_LABELS.map((label, index) => (
              <View key={index} style={styles.dayLabelSlot}>
                <Text style={styles.dayLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.weekColumns}>
              {weekColumns.map((week, columnIndex) => (
                <View key={columnIndex} style={styles.weekColumn}>
                  {week.map((date) => {
                    const key = toDateKey(date);
                    const count = dailyCounts[key] ?? 0;

                    return (
                      <View
                        key={key}
                        style={[styles.dayCell, { backgroundColor: getShadeColor(count) }]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
