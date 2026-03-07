import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

import { ActivityGrid } from "./src/components/ActivityGrid";
import { BottomNav } from "./src/components/BottomNav";
import { FloatingActionMenu } from "./src/components/FloatingActionMenu";
import { HabitModal } from "./src/components/HabitModal";
import { TaskCard } from "./src/components/TaskCard";
import { TaskModal } from "./src/components/TaskModal";
import { INITIAL_HABITS, INITIAL_TASKS } from "./src/constants";
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
  const [fabOpen, setFabOpen] = useState(false);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("Exercise");
  const [newHabitTasks, setNewHabitTasks] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(
    INITIAL_HABITS[0]?.id ?? null
  );

  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editHabitId, setEditHabitId] = useState<string | null>(null);

  const todayKey = toDateKey(new Date());
  const calendarDays = useMemo(() => buildCalendarDays(new Date()), [todayKey]);

  const habitMap = useMemo(() => {
    return habits.reduce<Record<string, Habit>>((acc, habit) => {
      acc[habit.id] = habit;
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

  const tasksByCategory = useMemo(() => {
    const groups: Record<string, HabitTask[]> = {};

    for (const task of tasks) {
      const category = habitMap[task.habitId]?.category ?? "Unassigned";
      if (!groups[category]) groups[category] = [];
      groups[category].push(task);
    }

    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [habitMap, tasks]);

  const topCategories = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const task of tasks) {
      const category = habitMap[task.habitId]?.category ?? "Unassigned";
      counts[category] = (counts[category] ?? 0) + task.completedDates.length;
    }

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [habitMap, tasks]);

  const habitActivity = useMemo(() => {
    return habits.map((habit) => {
      const habitTasks = tasks.filter((task) => task.habitId === habit.id);
      const counts: Record<string, number> = {};

      for (const task of habitTasks) {
        for (const date of task.completedDates) {
          counts[date] = (counts[date] ?? 0) + 1;
        }
      }

      return {
        habit,
        dailyCounts: counts,
        taskCount: habitTasks.length,
        completionCount: Object.values(counts).reduce((sum, count) => sum + count, 0),
      };
    });
  }, [habits, tasks]);

  const closeHabitModal = () => {
    setIsHabitModalOpen(false);
    setFabOpen(false);
    setNewHabitName("");
    setNewHabitCategory("Exercise");
    setNewHabitTasks("");
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setFabOpen(false);
    setNewTaskName("");
    setSelectedHabitId(habits[0]?.id ?? null);
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
    setFabOpen(true);
  };

  const openAddTask = () => {
    setSelectedHabitId(habits[0]?.id ?? null);
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

  const renderOverviewTab = () => (
    <>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>Habit Tracker</Text>
        <Text style={styles.pageTitle}>Overview</Text>
        <Text style={styles.pageSubtitle}>
          Use this home tab for quick progress, category coverage, and your active habits.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Overview is the extra tab I recommend.</Text>
        <Text style={styles.heroSubtitle}>
          It gives you a fast snapshot before you jump into detailed activity or task management.
        </Text>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedToday}</Text>
            <Text style={styles.statLabel}>Done today</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Top category</Text>
          <Text style={styles.summaryValue}>
            {topCategories[0]?.[0] ?? "None"}
          </Text>
          <Text style={styles.summaryAccent}>
            {topCategories[0]?.[1] ?? 0} completions so far
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total wins</Text>
          <Text style={styles.summaryValue}>{totalCompletions}</Text>
          <Text style={styles.summaryAccent}>Across all habits and categories</Text>
        </View>
      </View>

      <View style={styles.sectionHeaderStack}>
        <Text style={styles.sectionTitle}>Habits by category</Text>
        <Text style={styles.sectionSubtitle}>Exercise, diet, reading, and anything else you add</Text>
      </View>

      {habits.map((habit) => {
        const habitTaskCount = tasks.filter((task) => task.habitId === habit.id).length;

        return (
          <View key={habit.id} style={styles.habitRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{habit.category}</Text>
            </View>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.helperText}>{habitTaskCount} linked task{habitTaskCount === 1 ? "" : "s"}</Text>
          </View>
        );
      })}
    </>
  );

  const renderActivityTab = () => (
    <>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>All Habits</Text>
        <Text style={styles.pageTitle}>Activity Grid</Text>
        <Text style={styles.pageSubtitle}>
          Each habit has its own contribution grid, so Diet, Exercise, Reading, and new habits all stay separate.
        </Text>
      </View>

      {habitActivity.map(({ habit, dailyCounts: habitDailyCounts, taskCount, completionCount }) => (
        <ActivityGrid
          key={habit.id}
          calendarDays={calendarDays}
          dailyCounts={habitDailyCounts}
          title={habit.name}
          subtitle={`${habit.category} · ${taskCount} task${taskCount === 1 ? "" : "s"} · ${completionCount} completion${completionCount === 1 ? "" : "s"}`}
        />
      ))}
    </>
  );

  const renderTasksTab = () => (
    <>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>Manage</Text>
        <Text style={styles.pageTitle}>Tasks</Text>
        <Text style={styles.pageSubtitle}>
          Browse tasks grouped by category and mark them complete from here.
        </Text>
      </View>

      {tasksByCategory.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No tasks yet</Text>
          <Text style={styles.emptyText}>
            Use the floating + button to add a habit or create a task linked to an existing habit.
          </Text>
        </View>
      ) : (
        tasksByCategory.map(([category, categoryTasks]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{category}</Text>
              </View>
              <Text style={styles.categoryCount}>{categoryTasks.length} tasks</Text>
            </View>

            {categoryTasks.map((task) => {
              const habit = habitMap[task.habitId];

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  habitName={habit?.name ?? "Unassigned habit"}
                  category={habit?.category ?? "Unassigned"}
                  doneToday={task.completedDates.includes(todayKey)}
                  onComplete={completeTask}
                  onEdit={openEditTask}
                />
              );
            })}
          </View>
        ))
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "activity" && renderActivityTab()}
          {activeTab === "tasks" && renderTasksTab()}
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
        taskNames={newHabitTasks}
        onChangeHabitName={setNewHabitName}
        onChangeCategory={setNewHabitCategory}
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
