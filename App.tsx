import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { BottomNav } from "./src/components/BottomNav";
import { FloatingActionMenu } from "./src/components/FloatingActionMenu";
import { HabitModal } from "./src/components/HabitModal";
import { TaskModal } from "./src/components/TaskModal";
import { CATEGORY_OPTIONS, INITIAL_HABITS, INITIAL_TASKS } from "./src/constants";
import { ActivityScreen } from "./src/screens/ActivityScreen";
import { OverviewScreen } from "./src/screens/OverviewScreen";
import { TasksScreen } from "./src/screens/TasksScreen";
import { styles } from "./src/styles";
import type { Habit, HabitTask, TabKey } from "./src/types";
import { buildCalendarDays, toDateKey } from "./src/utils/habits";

function parseTaskNames(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [tasks, setTasks] = useState<HabitTask[]>(INITIAL_TASKS);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [fabOpen, setFabOpen] = useState(false);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("");
  const [newHabitTasks, setNewHabitTasks] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editHabitId, setEditHabitId] = useState<string | null>(null);

  const todayKey = toDateKey(new Date());
  const calendarDays = useMemo(() => buildCalendarDays(new Date()), [todayKey]);
  const habitCategoryById = useMemo(() => {
    return habits.reduce<Record<string, string>>((acc, habit) => {
      acc[habit.id] = habit.category;
      return acc;
    }, {});
  }, [habits]);

  const dailyCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const task of tasks) {
      for (const date of task.completedDates) {
        counts[date] = (counts[date] ?? 0) + 1;
      }
    }

    return counts;
  }, [tasks]);

  const totalCompletions = useMemo(
    () => Object.values(dailyCounts).reduce((sum, count) => sum + count, 0),
    [dailyCounts]
  );

  const completedToday = dailyCounts[todayKey] ?? 0;

  const topCategories = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const task of tasks) {
      const category = habitCategoryById[task.habitId] ?? "Unassigned";
      counts[category] = (counts[category] ?? 0) + task.completedDates.length;
    }

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [habitCategoryById, tasks]);

  const categoryOptions = useMemo(() => {
    return Array.from(
      new Set([
        ...CATEGORY_OPTIONS,
        ...customCategories,
        ...habits.map((habit) => habit.category),
      ])
    );
  }, [customCategories, habits]);

  const closeHabitModal = () => {
    setIsHabitModalOpen(false);
    setFabOpen(false);
    setNewHabitName("");
    setNewHabitCategory("");
    setNewHabitTasks("");
  };

  const addCategoryOption = (value: string) => {
    const nextCategory = value.trim();
    if (!nextCategory) return;

    setCustomCategories((current) =>
      current.includes(nextCategory) ? current : [...current, nextCategory]
    );
    setNewHabitCategory(nextCategory);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setFabOpen(false);
    setNewTaskName("");
    setSelectedHabitId(null);
  };

  const closeEditTaskModal = () => {
    setIsEditTaskOpen(false);
    setEditingTaskId(null);
    setEditTaskName("");
    setEditHabitId(null);
  };

  const openAddHabit = () => {
    setIsHabitModalOpen(true);
    setIsTaskModalOpen(false);
    setNewHabitCategory("");
    setFabOpen(true);
  };

  const openAddTask = () => {
    setSelectedHabitId(null);
    setIsTaskModalOpen(true);
    setIsHabitModalOpen(false);
    setFabOpen(true);
  };

  const addHabit = () => {
    const name = newHabitName.trim();
    const category = newHabitCategory.trim() || "General";
    if (!name) return;

    const habitId = `habit-${Date.now()}`;
    const createdHabit: Habit = {
      id: habitId,
      name,
      category,
    };
    const seededTasks = parseTaskNames(newHabitTasks).map((taskName, index) => ({
      id: `${habitId}-task-${index}-${Date.now()}`,
      title: taskName,
      habitId,
      completedDates: [],
    }));

    setHabits((current) => [createdHabit, ...current]);
    if (seededTasks.length > 0) {
      setTasks((current) => [...seededTasks, ...current]);
    }
    setSelectedHabitId(habitId);
    closeHabitModal();
  };

  const addTask = () => {
    const title = newTaskName.trim();
    if (!title || !selectedHabitId) return;

    setTasks((current) => [
      {
        id: `task-${Date.now()}`,
        title,
        habitId: selectedHabitId,
        completedDates: [],
      },
      ...current,
    ]);
    closeTaskModal();
  };

  const openEditTask = (task: HabitTask) => {
    setEditingTaskId(task.id);
    setEditTaskName(task.title);
    setEditHabitId(task.habitId);
    setIsEditTaskOpen(true);
  };

  const saveTask = () => {
    const title = editTaskName.trim();
    if (!editingTaskId || !title || !editHabitId) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === editingTaskId ? { ...task, title, habitId: editHabitId } : task
      )
    );
    closeEditTaskModal();
  };

  const deleteTask = () => {
    if (!editingTaskId) return;

    setTasks((current) => current.filter((task) => task.id !== editingTaskId));
    closeEditTaskModal();
  };

  const completeTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId || task.completedDates.includes(todayKey)) {
          return task;
        }

        return { ...task, completedDates: [...task.completedDates, todayKey] };
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === "overview" && (
            <OverviewScreen
              habits={habits}
              tasks={tasks}
              completedToday={completedToday}
              totalCompletions={totalCompletions}
              topCategories={topCategories}
            />
          )}
          {activeTab === "activity" && (
            <ActivityScreen habits={habits} tasks={tasks} calendarDays={calendarDays} />
          )}
          {activeTab === "tasks" && (
            <TasksScreen
              habits={habits}
              tasks={tasks}
              todayKey={todayKey}
              onCompleteTask={completeTask}
              onEditTask={openEditTask}
            />
          )}
        </ScrollView>

        <FloatingActionMenu
          open={fabOpen}
          onToggle={() => setFabOpen((current) => !current)}
          onAddHabit={openAddHabit}
          onAddTask={openAddTask}
        />

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </View>

      <HabitModal
        visible={isHabitModalOpen}
        habitName={newHabitName}
        category={newHabitCategory}
        categories={categoryOptions}
        taskNames={newHabitTasks}
        onChangeHabitName={setNewHabitName}
        onChangeCategory={setNewHabitCategory}
        onAddCategory={addCategoryOption}
        onChangeTaskNames={setNewHabitTasks}
        onSubmit={addHabit}
        onRequestClose={closeHabitModal}
      />

      <TaskModal
        visible={isTaskModalOpen}
        title="Add Task"
        subtitle="Create a task and link it to one of your habits."
        nameValue={newTaskName}
        selectedHabitId={selectedHabitId}
        habits={habits}
        submitLabel="Save Task"
        onChangeName={setNewTaskName}
        onSelectHabit={setSelectedHabitId}
        onSubmit={addTask}
        onRequestClose={closeTaskModal}
      />

      <TaskModal
        visible={isEditTaskOpen}
        title="Edit Task"
        subtitle="Update the task name or move it to a different habit."
        nameValue={editTaskName}
        selectedHabitId={editHabitId}
        habits={habits}
        submitLabel="Update Task"
        secondaryLabel="Delete"
        onChangeName={setEditTaskName}
        onSelectHabit={setEditHabitId}
        onSecondaryPress={deleteTask}
        onSubmit={saveTask}
        onRequestClose={closeEditTaskModal}
      />
    </SafeAreaView>
  );
}
