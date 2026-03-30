export type Habit = {
  id: string;
  name: string;
  category: string;
  color: string;
  icon: string;
};

export type HabitTask = {
  id: string;
  title: string;
  habitId: string;
  completedDates: string[];
};

export type Activity = {
  id: string;
  taskId: string;
  dateKey: string; // YYYY-MM-DD in the user’s local time
};
