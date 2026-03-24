import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { FloatingActionMenu } from "./src/components/FloatingActionMenu";
import { HabitModal } from "./src/components/HabitModal";
import { PageHeader } from "./src/components/PageHeader";
import { TaskModal } from "./src/components/TaskModal";
import { CATEGORY_OPTIONS, DEFAULT_HABIT_COLOR, INITIAL_HABITS, INITIAL_TASKS } from "./src/constants";
import { HabitScreen } from "./src/screens/HabitScreen";
import { OverviewScreen } from "./src/screens/OverviewScreen";
import { styles } from "./src/styles";
import type { Habit, HabitTask } from "./src/types";
import { toNormalizedHexColor } from "./src/utils/colors";
import { buildCalendarDays, toDateKey } from "./src/utils/habits";

function parseTaskNames(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function App() {
  const [route, setRoute] = useState<{ name: "overview" } | { name: "habit"; habitId: string }>({
    name: "overview",
  });
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [tasks, setTasks] = useState<HabitTask[]>(INITIAL_TASKS);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [fabOpen, setFabOpen] = useState(false);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitIcon, setNewHabitIcon] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("");
  const [newHabitColor, setNewHabitColor] = useState(DEFAULT_HABIT_COLOR);
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
    setNewHabitIcon("");
    setNewHabitCategory("");
    setNewHabitColor(DEFAULT_HABIT_COLOR);
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
    setNewHabitIcon("");
    setNewHabitCategory("");
    setNewHabitColor(DEFAULT_HABIT_COLOR);
    setFabOpen(true);
  };

  const openAddTaskFromOverview = () => {
    setSelectedHabitId(null);
    setIsTaskModalOpen(true);
    setIsHabitModalOpen(false);
    setFabOpen(true);
  };

  const openAddTaskFromHabit = () => {
    if (route.name !== "habit") return;

    setSelectedHabitId(route.habitId);
    setIsTaskModalOpen(true);
    setIsHabitModalOpen(false);
    setFabOpen(false);
  };

  const addHabit = () => {
    const name = newHabitName.trim();
    const category = newHabitCategory.trim() || "General";
    const color = toNormalizedHexColor(newHabitColor) ?? DEFAULT_HABIT_COLOR;
    if (!name) return;

    const habitId = `habit-${Date.now()}`;
    const createdHabit: Habit = {
      id: habitId,
      name,
      category,
      color,
      icon: newHabitIcon.trim(),
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
    setRoute({ name: "habit", habitId });
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

  const activeHabit = useMemo(() => {
    if (route.name !== "habit") return null;
    return habits.find((habit) => habit.id === route.habitId) ?? null;
  }, [habits, route]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.screen}>
        {route.name === "overview" ? (
          <ScrollView contentContainerStyle={styles.content}>
            <OverviewScreen
              habits={habits}
              tasks={tasks}
              calendarDays={calendarDays}
              dailyCounts={dailyCounts}
              completedToday={completedToday}
              totalCompletions={totalCompletions}
              onSelectHabit={(habitId) => {
                setFabOpen(false);
                setRoute({ name: "habit", habitId });
              }}
            />
          </ScrollView>
        ) : activeHabit ? (
          <>
            <View style={styles.stickyHeaderContainer}>
              <PageHeader
                title={`${activeHabit.icon ? `${activeHabit.icon} ` : ""}${activeHabit.name}`}
                onBack={() => {
                  setFabOpen(false);
                  setRoute({ name: "overview" });
                }}
                backLabel="Overview"
              />
            </View>
            <ScrollView contentContainerStyle={styles.contentBelowStickyHeader}>
              <HabitScreen
                habit={activeHabit}
                tasks={tasks.filter((task) => task.habitId === activeHabit.id)}
                calendarDays={calendarDays}
                todayKey={todayKey}
                onCompleteTask={completeTask}
                onEditTask={openEditTask}
              />
            </ScrollView>
          </>
        ) : null}

        {route.name === "overview" ? (
          <FloatingActionMenu
            open={fabOpen}
            onToggle={() => setFabOpen((current) => !current)}
            onAddHabit={openAddHabit}
            onAddTask={openAddTaskFromOverview}
          />
        ) : (
          <FloatingActionMenu variant="quickAddTask" onAddTask={openAddTaskFromHabit} />
        )}
      </View>

      <HabitModal
        visible={isHabitModalOpen}
        habitName={newHabitName}
        icon={newHabitIcon}
        category={newHabitCategory}
        color={newHabitColor}
        categories={categoryOptions}
        taskNames={newHabitTasks}
        onChangeHabitName={setNewHabitName}
        onChangeIcon={setNewHabitIcon}
        onChangeCategory={setNewHabitCategory}
        onChangeColor={setNewHabitColor}
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
