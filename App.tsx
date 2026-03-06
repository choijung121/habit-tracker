import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

import { ActivityGrid } from "./src/components/ActivityGrid";
import { HeroCard } from "./src/components/HeroCard";
import { TaskCard } from "./src/components/TaskCard";
import { TaskModal } from "./src/components/TaskModal";
import { INITIAL_TASKS } from "./src/constants";
import { styles } from "./src/styles";
import type { HabitTask } from "./src/types";
import { buildCalendarDays, toDateKey } from "./src/utils/habits";

export default function App() {
  const [tasks, setTasks] = useState<HabitTask[]>(INITIAL_TASKS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("");

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

  const closeAddModal = () => {
    setIsAddOpen(false);
    setNewTitle("");
    setNewType("");
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingId(null);
    setEditTitle("");
    setEditType("");
  };

  const openEditModal = (task: HabitTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditType(task.type);
    setIsEditOpen(true);
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

  const addTask = () => {
    const title = newTitle.trim();
    const type = newType.trim();

    if (!title || !type) return;

    setTasks((current) => [
      {
        id: Date.now().toString(),
        title,
        type,
        completedDates: [],
      },
      ...current,
    ]);
    closeAddModal();
  };

  const saveTask = () => {
    const title = editTitle.trim();
    const type = editType.trim();

    if (!editingId || !title || !type) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === editingId ? { ...task, title, type } : task
      )
    );
    closeEditModal();
  };

  const deleteTask = () => {
    if (!editingId) return;

    setTasks((current) => current.filter((task) => task.id !== editingId));
    closeEditModal();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <HeroCard
          taskCount={tasks.length}
          completedToday={completedToday}
          totalCompletions={totalCompletions}
          onAddPress={() => setIsAddOpen(true)}
        />

        <ActivityGrid calendarDays={calendarDays} dailyCounts={dailyCounts} />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today&apos;s tasks</Text>
            <Text style={styles.sectionSubtitle}>Tap Complete to log progress</Text>
          </View>
        </View>

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            doneToday={task.completedDates.includes(todayKey)}
            onComplete={completeTask}
            onEdit={openEditModal}
          />
        ))}
      </ScrollView>

      <TaskModal
        visible={isAddOpen}
        title="Add a new task"
        subtitle="Create a habit and assign a category."
        nameValue={newTitle}
        typeValue={newType}
        submitLabel="Save"
        secondaryLabel="Cancel"
        onChangeName={setNewTitle}
        onChangeType={setNewType}
        onSecondaryPress={closeAddModal}
        onSubmit={addTask}
        onRequestClose={closeAddModal}
      />

      <TaskModal
        visible={isEditOpen}
        title="Edit task"
        subtitle="Update the title or category, or remove it."
        nameValue={editTitle}
        typeValue={editType}
        submitLabel="Update"
        secondaryLabel="Delete"
        onChangeName={setEditTitle}
        onChangeType={setEditType}
        onSecondaryPress={deleteTask}
        onSubmit={saveTask}
        onRequestClose={closeEditModal}
      />
    </SafeAreaView>
  );
}
