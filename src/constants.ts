import type { Habit, HabitTask, TabKey } from "./types";
import { buildShadeScale } from "./utils/colors";

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const GRID_WEEKS = 52;
export const GRID_DAYS = GRID_WEEKS * 7;
export const SHADE_SCALE = (baseColor: string) => buildShadeScale(baseColor);
export const CATEGORY_OPTIONS = ["Exercise", "Diet", "Reading", "Learning", "Creative"];
export const DEFAULT_HABIT_COLOR = "#2D5B22";

export const NAV_ITEMS: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "tasks", label: "Tasks" },
];

export const INITIAL_HABITS: Habit[] = [
  { id: "habit-1", name: "Morning Wellness", category: "Exercise", color: "#2D5B22" },
  { id: "habit-2", name: "Fuel Better", category: "Diet", color: "#B3261E" },
  { id: "habit-3", name: "Night Reading", category: "Reading", color: "#1D4ED8" },
];

export const INITIAL_TASKS: HabitTask[] = [
  { id: "task-1", title: "30 min run", habitId: "habit-1", completedDates: [] },
  { id: "task-2", title: "Stretch after workout", habitId: "habit-1", completedDates: [] },
  { id: "task-3", title: "Eat a high-protein lunch", habitId: "habit-2", completedDates: [] },
  { id: "task-4", title: "Read 20 pages", habitId: "habit-3", completedDates: [] },
];
