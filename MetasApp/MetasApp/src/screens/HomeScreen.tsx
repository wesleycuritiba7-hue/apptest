import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadAllTasks, PERIODS, PERIOD_LABELS,
  PERIOD_ICONS, PERIOD_COLORS, Task, Period,
} from '../utils/storage';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const BG = '#0E0E10', CARD = '#1E1E23', BORDER = '#2A2A32';
const ACCENT = '#C8F135', TEXT = '#F0F0F5', MUTED = '#6B6B80', DANGER = '#FF6B6B';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [allTasks, setAllTasks] = useState<Record<Period, Task[]>>({} as any);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    loadAllTasks().then(d => { setAllTasks(d); setLoading(false); });
  }, []));

  const totalAll   = PERIODS.reduce((a, p) => a + (allTasks[p]?.length || 0), 0);
  const doneAll    = PERIODS.reduce((a, p) => a + (allTasks[p]?.filter(t => t.done).length || 0), 0);
  const pendingAll = totalAll - doneAll;
  const pct        = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator color={ACCENT} size="large" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ME<Text style={{ color: ACCENT }}>.</Text>TAS</Text>
          <Text style={styles.subtitle}>TRACKER DE METAS PESSOAIS</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total',      num: totalAll,   color: TEXT   },
            { label: 'Concluídas', num: doneAll,    color: ACCENT },
            { label: 'Pendentes',  num: pendingAll, color: DANGER },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statNum, { color: s.color }]}>{s.num}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>PROGRESSO GERAL</Text>
            <Text style={styles.progressPct}>{pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
          </View>
          <Text style={styles.progressSub}>{doneAll} de {totalAll} metas concluídas</Text>
        </View>

        {/* Period cards */}
        <Text style={styles.sectionTitle}>POR PERÍODO</Text>
        {PERIODS.map(period => {
          const tasks = allTasks[period] || [];
          const done  = tasks.filter(t => t.done).length;
          const total = tasks.length;
          const p     = total > 0 ? Math.round((done / total) * 100) : 0;
          const color = PERIOD_COLORS[period];
          return (
            <TouchableOpacity
              key={period}
              style={styles.periodCard}
              onPress={() => navigation.navigate('Metas', { period })}
              activeOpacity={0.75}
            >
              <View style={[styles.periodIcon, { backgroundColor: color + '22' }]}>
                <Ionicons name={PERIOD_ICONS[period] as IoniconsName} size={22} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.periodTop}>
                  <Text style={styles.periodLabel}>{PERIOD_LABELS[period]}</Text>
                  <Text style={[styles.periodPct, { color }]}>{p}%</Text>
                </View>
                <View style={styles.periodTrack}>
                  <View style={[styles.periodFill, { width: `${p}%` as any, backgroundColor: color }]} />
                </View>
                <Text style={styles.periodSub}>{done}/{total} concluídas</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={MUTED} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: BG },
  scroll:         { padding: 20 },
  header:         { marginBottom: 28 },
  logo:           { fontSize: 38, fontWeight: '900', color: TEXT, letterSpacing: -2 },
  subtitle:       { fontSize: 11, fontWeight: '600', color: MUTED, letterSpacing: 2, marginTop: 2 },
  statsRow:       { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard:       { flex: 1, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 16, alignItems: 'center' },
  statNum:        { fontSize: 28, fontWeight: '900' },
  statLabel:      { fontSize: 10, color: MUTED, fontWeight: '600', letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' },
  progressCard:   { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 18, marginBottom: 28 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressTitle:  { fontSize: 11, fontWeight: '700', color: MUTED, letterSpacing: 1.5 },
  progressPct:    { fontSize: 22, fontWeight: '900', color: ACCENT },
  progressTrack:  { height: 8, backgroundColor: BORDER, borderRadius: 99, overflow: 'hidden' },
  progressFill:   { height: '100%', backgroundColor: ACCENT, borderRadius: 99, minWidth: 4 },
  progressSub:    { fontSize: 11, color: MUTED, marginTop: 8 },
  sectionTitle:   { fontSize: 11, fontWeight: '700', color: MUTED, letterSpacing: 2, marginBottom: 14 },
  periodCard:     { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10 },
  periodIcon:     { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  periodTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  periodLabel:    { fontSize: 15, fontWeight: '700', color: TEXT },
  periodPct:      { fontSize: 14, fontWeight: '800' },
  periodTrack:    { height: 4, backgroundColor: BORDER, borderRadius: 99, overflow: 'hidden', marginBottom: 6 },
  periodFill:     { height: '100%', borderRadius: 99, minWidth: 4 },
  periodSub:      { fontSize: 11, color: MUTED },
});
