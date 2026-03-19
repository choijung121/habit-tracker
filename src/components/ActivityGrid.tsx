import React, { useMemo, useRef } from "react";
import { ScrollView, Text, View } from "react-native";

import { DAY_LABELS, GRID_WEEKS, SHADE_SCALE } from "../constants";
import { styles } from "../styles";
import { getShadeColor, shiftDate, toDateKey } from "../utils/habits";

type ActivityGridProps = {
  calendarDays: Date[];
  dailyCounts: Record<string, number>;
  baseColor: string;
  title?: string;
  subtitle?: string;
};

export function ActivityGrid({
  calendarDays,
  dailyCounts,
  baseColor,
  title = "Activity",
  subtitle = `Last ${GRID_WEEKS} weeks`,
}: ActivityGridProps) {
  const scrollRef = useRef<ScrollView | null>(null);
  const didAutoScrollRef = useRef(false);
  const shadeScale = useMemo(() => SHADE_SCALE(baseColor), [baseColor]);

  const todayTime = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }, []);

  const weekStarts = useMemo(() => {
    const daysThroughToday = calendarDays.filter((date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized.getTime() <= todayTime;
    });

    if (daysThroughToday.length === 0) return [];

    const first = new Date(daysThroughToday[0]);
    first.setHours(0, 0, 0, 0);
    // Align to Sunday so each column maps cleanly to DAY_LABELS.
    first.setDate(first.getDate() - first.getDay());

    const todayWeekStart = new Date(todayTime);
    todayWeekStart.setDate(todayWeekStart.getDate() - todayWeekStart.getDay());

    const weeks =
      Math.floor((todayWeekStart.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

    return Array.from({ length: Math.max(0, weeks) }, (_, index) => shiftDate(first, index * 7));
  }, [calendarDays, todayTime]);

  const weekColumns = useMemo(() => {
    return weekStarts.map((weekStart) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const date = shiftDate(weekStart, dayIndex);
        return date.getTime() > todayTime ? null : date;
      })
    );
  }, [todayTime, weekStarts]);

  const monthLabels = useMemo(() => {
    return weekStarts.map((weekStart) => weekStart.toLocaleString("en-US", { month: "short" }));
  }, [weekStarts]);

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <View style={styles.calendarShell}>
        <View style={styles.calendarRow}>
          <View style={styles.dayLabelsColumn}>
            <View style={styles.monthSpacer} />
            <View style={styles.dayLabels}>
              {DAY_LABELS.map((label, index) => (
                <View key={index} style={styles.dayLabelSlot}>
                  <Text style={styles.dayLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
          <ScrollView
            ref={(node) => {
              scrollRef.current = node;
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={() => {
              // Default view should anchor on the most recent day (today) at the far right.
              if (didAutoScrollRef.current) return;
              didAutoScrollRef.current = true;
              scrollRef.current?.scrollToEnd({ animated: false });
            }}
          >
            <View>
              <View style={styles.monthRow}>
                {monthLabels.map((label, index) => (
                  <View key={`${label}-${index}`} style={styles.monthLabelSlot}>
                    <Text style={styles.monthLabelText} numberOfLines={1} ellipsizeMode="clip">
                      {index > 0 && monthLabels[index - 1] === label ? "" : label}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.weekColumns}>
                {weekColumns.map((week, columnIndex) => (
                  <View key={columnIndex} style={styles.weekColumn}>
                    {week.map((date, rowIndex) => {
                      if (!date) {
                        return <View key={`empty-${columnIndex}-${rowIndex}`} style={styles.dayCellEmpty} />;
                      }

                      const key = toDateKey(date);
                      const count = dailyCounts[key] ?? 0;

                      return (
                        <View
                          key={key}
                          style={[styles.dayCell, { backgroundColor: getShadeColor(count, shadeScale) }]}
                        />
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.legend}>
          <Text style={styles.legendText}>Less</Text>
          {shadeScale.map((color) => (
            <View key={color} style={[styles.legendSwatch, { backgroundColor: color }]} />
          ))}
          <Text style={styles.legendText}>More</Text>
        </View>
    </View>
  );
}
