import type { Habit, HabitTask, TabKey } from "./types";

export const DAY_LABELS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
export const GRID_WEEKS = 18;
export const GRID_DAYS = GRID_WEEKS * 7;
export const SHADE_SCALE = ["#FFFFFF", "#DCE7CF", "#B7D191", "#74A656", "#2D5B22"];
export const CATEGORY_OPTIONS = ["Exercise", "Diet", "Reading", "Learning", "Creative"];

export const NAV_ITEMS: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "tasks", label: "Tasks" },
];

export const INITIAL_HABITS: Habit[] = [
  { id: "habit-1", name: "Morning Wellness", category: "Exercise" },
  { id: "habit-2", name: "Fuel Better", category: "Diet" },
  { id: "habit-3", name: "Night Reading", category: "Reading" },
];

export const INITIAL_TASKS: HabitTask[] = [
  { id: "task-1", title: "30 min run", habitId: "habit-1", completedDates: [] },
  { id: "task-2", title: "Stretch after workout", habitId: "habit-1", completedDates: [] },
  { id: "task-3", title: "Eat a high-protein lunch", habitId: "habit-2", completedDates: [] },
  { id: "task-4", title: "Read 20 pages", habitId: "habit-3", completedDates: [] },
];
