import type { HabitTask } from "./types";

export const DAY_LABELS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
export const GRID_WEEKS = 18;
export const GRID_DAYS = GRID_WEEKS * 7;
export const SHADE_SCALE = ["#FFFFFF", "#DCE7CF", "#B7D191", "#74A656", "#2D5B22"];

export const INITIAL_TASKS: HabitTask[] = [
  { id: "1", title: "Morning Run", type: "Health", completedDates: [] },
  { id: "2", title: "Read 20 Pages", type: "Learning", completedDates: [] },
  { id: "3", title: "Practice Design", type: "Creative", completedDates: [] },
];
