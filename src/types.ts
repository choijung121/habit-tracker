export type Habit = {
  id: string;
  name: string;
  category: string;
  color: string;
};

export type HabitTask = {
  id: string;
  title: string;
  habitId: string;
  completedDates: string[];
};

export type TabKey = "overview" | "activity" | "tasks";
