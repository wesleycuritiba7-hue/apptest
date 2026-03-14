import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadTasks, saveTasks, PERIODS, PERIOD_LABELS,
  PERIOD_ICONS, PERIOD_COLORS, Task, Period, generateId,
} from '../utils/storage';

const BG = '#0E0E10', SURFACE = '#17171A', CARD = '#1E1E23', BORDER = '#2A2A32';
const ACCENT = '#C8F135', TEXT = '#F0F0F5', MUTED = '#6B6B80';

export default function PeriodScreen() {
  const route = useRoute<any>();
  const [activePeriod, setActivePeriod] = useState<Period>(route.params?.period || 'diaria');
  const [tasksByPeriod, setTasksByPeriod] = useState<Record<Period, Task[]>>({} as any);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(useCallback(() => {
    if (route.params?.period) setActivePeriod(route.params.period);
    loadAll();
  }, [route.params?.period]));

  async function loadAll() {
    const all: any = {};
    for (const p of PERIODS) all[p] = await loadTasks(p);
    setTasksByPeriod(all);
  }

  const tasks: Task[] = tasksByPeriod[activePeriod] || [];
  const done    = tasks.filter(t => t.done).length;
  const pending = tasks.length - done;
  const color   = PERIOD_COLORS[activePeriod];

  async function addTask() {
    const text = inputText.trim();
    if (!text) return;
    const updated = [...tasks, { id: generateId(), text, done: false, createdAt: Date.now() }];
    setTasksByPeriod(prev => ({ ...prev, [activePeriod]: updated }));
    await saveTasks(activePeriod, updated);
    setInputText('');
  }

  async function toggleTask(id: string) {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasksByPeriod(prev => ({ ...prev, [activePeriod]: updated }));
    await saveTasks(activePeriod, updated);
  }

  function deleteTask(id: string) {
    Alert.alert('Remover meta', 'Deseja remover esta meta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const updated = tasks.filter(t => t.id !== id);
          setTasksByPeriod(prev => ({ ...prev, [activePeriod]: updated }));
          await saveTasks(activePeriod, updated);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: color + '22' }]}>
            <Ionicons name={PERIOD_ICONS[activePeriod]} size={22} color={color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Metas {PERIOD_LABELS[activePeriod]}s</Text>
            <Text style={styles.headerSub}>{done} concluídas · {pending} pendentes</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer} style={styles.tabsScroll}>
          {PERIODS.map(p => {
            const active = p === activePeriod;
            const c = PERIOD_COLORS[p];
            return (
              <TouchableOpacity
                key={p}
                style={[styles.tab, active && { backgroundColor: c, borderColor: c }]}
                onPress={() => { setActivePeriod(p); setInputText(''); }}
              >
                <Ionicons name={PERIOD_ICONS[p]} size={13} color={active ? '#0E0E10' : MUTED} style={{ marginRight: 5 }} />
                <Text style={[styles.tabText, active && { color: '#0E0E10' }]}>{PERIOD_LABELS[p]}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* List */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name={PERIOD_ICONS[activePeriod]} size={52} color={BORDER} />
              <Text style={styles.emptyTitle}>Nenhuma meta ainda</Text>
              <Text style={styles.emptySub}>Adicione sua primeira meta {PERIOD_LABELS[activePeriod].toLowerCase()}!</Text>
            </View>
          ) : (
            tasks.map(task => (
              <TouchableOpacity key={task.id}
                style={[styles.taskCard, task.done && styles.taskCardDone]}
                onPress={() => toggleTask(task.id)} activeOpacity={0.75}>
                <TouchableOpacity
                  style={[styles.checkBtn, task.done && { backgroundColor: color, borderColor: color }]}
                  onPress={() => toggleTask(task.id)}>
                  {task.done && <Ionicons name="checkmark" size={14} color="#0E0E10" />}
                </TouchableOpacity>
                <Text style={[styles.taskText, task.done && styles.taskTextDone]} numberOfLines={3}>
                  {task.text}
                </Text>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTask(task.id)}>
                  <Ionicons name="trash-outline" size={16} color={MUTED} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Add bar */}
        <View style={styles.addBar}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={`Nova meta ${PERIOD_LABELS[activePeriod].toLowerCase()}...`}
            placeholderTextColor={MUTED}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: inputText.trim() ? color : BORDER }]}
            onPress={addTask} disabled={!inputText.trim()}>
            <Ionicons name="add" size={26} color={inputText.trim() ? '#0E0E10' : MUTED} />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: BG },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, gap: 14 },
  headerIcon:    { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontSize: 20, fontWeight: '800', color: TEXT },
  headerSub:     { fontSize: 12, color: MUTED, marginTop: 2 },
  tabsScroll:    { maxHeight: 48, marginBottom: 4 },
  tabsContainer: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  tab:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: BORDER, backgroundColor: CARD },
  tabText:       { fontSize: 12, fontWeight: '600', color: MUTED },
  listContent:   { paddingHorizontal: 20, paddingTop: 12 },
  emptyState:    { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle:    { fontSize: 16, fontWeight: '700', color: MUTED },
  emptySub:      { fontSize: 13, color: MUTED, textAlign: 'center', opacity: 0.7 },
  taskCard:      { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 13, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  taskCardDone:  { opacity: 0.5 },
  checkBtn:      { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  taskText:      { flex: 1, fontSize: 14, color: TEXT, lineHeight: 20 },
  taskTextDone:  { textDecorationLine: 'line-through', color: MUTED },
  deleteBtn:     { padding: 4 },
  addBar:        { flexDirection: 'row', padding: 16, gap: 10, borderTopWidth: 1, borderTopColor: BORDER, backgroundColor: SURFACE },
  input:         { flex: 1, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: TEXT, fontSize: 14 },
  addBtn:        { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
