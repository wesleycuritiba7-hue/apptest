import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadAllTasks, PERIODS, PERIOD_LABELS,
  PERIOD_ICONS, PERIOD_COLORS, Task, Period,
} from '../utils/storage';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const BG = '#0E0E10', CARD = '#1E1E23', BORDER = '#2A2A32', SURFACE = '#17171A';
const ACCENT = '#C8F135', TEXT = '#F0F0F5', MUTED = '#6B6B80', DANGER = '#FF6B6B';

export default function StatsScreen() {
  const [allTasks, setAllTasks] = useState<Record<Period, Task[]>>({} as any);

  useFocusEffect(useCallback(() => {
    loadAllTasks().then(setAllTasks);
  }, []));

  const totalAll   = PERIODS.reduce((a, p) => a + (allTasks[p]?.length || 0), 0);
  const doneAll    = PERIODS.reduce((a, p) => a + (allTasks[p]?.filter(t => t.done).length || 0), 0);
  const pendingAll = totalAll - doneAll;
  const pct        = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  const motivMsg =
    pct === 100 ? '🎉 Parabéns! Você completou todas as suas metas!'
    : pct >= 75  ? `Incrível! Você está a ${100 - pct}% de completar tudo!`
    : pct >= 50  ? 'Na metade do caminho! Continue assim!'
    : pct > 0    ? `Bom começo! Você concluiu ${pct}% das suas metas.`
    :              `Você tem ${totalAll} metas esperando por você. Vamos lá!`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.pageTitle}>Progresso</Text>
        <Text style={styles.pageSub}>Acompanhe sua evolução em todas as áreas</Text>

        {/* Big stat card */}
        <View style={styles.bigCard}>
          {/* Circle visual */}
          <View style={styles.circleWrap}>
            <View style={styles.circleOuter}>
              <View style={styles.circleInner}>
                <Text style={styles.circlePct}>{pct}%</Text>
                <Text style={styles.circleLabel}>concluído</Text>
              </View>
            </View>
          </View>
          <View style={styles.bigStats}>
            <View style={styles.bigStatItem}>
              <Text style={[styles.bigStatNum, { color: TEXT }]}>{totalAll}</Text>
              <Text style={styles.bigStatLbl}>TOTAL</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.bigStatItem}>
              <Text style={[styles.bigStatNum, { color: ACCENT }]}>{doneAll}</Text>
              <Text style={styles.bigStatLbl}>FEITAS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.bigStatItem}>
              <Text style={[styles.bigStatNum, { color: DANGER }]}>{pendingAll}</Text>
              <Text style={styles.bigStatLbl}>RESTAM</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>DETALHES POR PERÍODO</Text>

        {PERIODS.map(period => {
          const tasks = allTasks[period] || [];
          const done  = tasks.filter(t => t.done).length;
          const total = tasks.length;
          const p     = total > 0 ? Math.round((done / total) * 100) : 0;
          const color = PERIOD_COLORS[period];

          return (
            <View key={period} style={styles.periodCard}>
              <View style={styles.periodTop}>
                <View style={[styles.periodIcon, { backgroundColor: color + '22' }]}>
                  <Ionicons name={PERIOD_ICONS[period] as IoniconsName} size={20} color={color} />
                </View>
                <Text style={styles.periodLabel}>{PERIOD_LABELS[period]}</Text>
                <Text style={[styles.periodPct, { color }]}>{p}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${p}%` as any, backgroundColor: color }]} />
              </View>
              <View style={styles.periodFooter}>
                {[
                  { num: total,        label: 'Total',      color: TEXT  },
                  { num: done,         label: 'Concluídas', color: color },
                  { num: total - done, label: 'Pendentes',  color: DANGER },
                ].map(s => (
                  <View key={s.label} style={styles.periodStat}>
                    <Text style={[styles.periodStatNum, { color: s.color }]}>{s.num}</Text>
                    <Text style={styles.periodStatLbl}>{s.label}</Text>
                  </View>
                ))}
              </View>
              {tasks.length > 0 && (
                <View style={styles.pillRow}>
                  {tasks.slice(0, 4).map(t => (
                    <View key={t.id} style={[styles.pill, t.done && { backgroundColor: color + '1A', borderColor: color + '44' }]}>
                      <Ionicons name={(t.done ? 'checkmark-circle' : 'ellipse-outline') as IoniconsName} size={11} color={t.done ? color : MUTED} />
                      <Text style={[styles.pillText, t.done && { color }]} numberOfLines={1}>{t.text}</Text>
                    </View>
                  ))}
                  {tasks.length > 4 && <Text style={styles.pillMore}>+{tasks.length - 4}</Text>}
                </View>
              )}
            </View>
          );
        })}

        {totalAll > 0 && (
          <View style={styles.motivCard}>
            <Ionicons name="rocket" size={22} color={ACCENT} />
            <Text style={styles.motivText}>{motivMsg}</Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: BG },
  scroll:        { padding: 20 },
  pageTitle:     { fontSize: 30, fontWeight: '900', color: TEXT, letterSpacing: -1 },
  pageSub:       { fontSize: 13, color: MUTED, marginTop: 4, marginBottom: 24 },
  bigCard:       { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 28 },
  circleWrap:    { marginBottom: 22 },
  circleOuter:   { width: 130, height: 130, borderRadius: 65, borderWidth: 10, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  circleInner:   { alignItems: 'center' },
  circlePct:     { fontSize: 30, fontWeight: '900', color: TEXT },
  circleLabel:   { fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: 'uppercase' },
  bigStats:      { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  bigStatItem:   { alignItems: 'center', flex: 1 },
  bigStatNum:    { fontSize: 24, fontWeight: '900' },
  bigStatLbl:    { fontSize: 10, color: MUTED, letterSpacing: 1.5, marginTop: 4, textTransform: 'uppercase' },
  divider:       { width: 1, height: 36, backgroundColor: BORDER },
  sectionTitle:  { fontSize: 11, fontWeight: '700', color: MUTED, letterSpacing: 2, marginBottom: 14 },
  periodCard:    { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, borderRadius: 16, padding: 16, marginBottom: 12 },
  periodTop:     { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  periodIcon:    { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  periodLabel:   { flex: 1, fontSize: 16, fontWeight: '700', color: TEXT },
  periodPct:     { fontSize: 18, fontWeight: '900' },
  barTrack:      { height: 6, backgroundColor: BORDER, borderRadius: 99, overflow: 'hidden', marginBottom: 14 },
  barFill:       { height: '100%', borderRadius: 99, minWidth: 4 },
  periodFooter:  { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  periodStat:    { alignItems: 'center' },
  periodStatNum: { fontSize: 18, fontWeight: '800' },
  periodStatLbl: { fontSize: 10, color: MUTED, letterSpacing: 1, marginTop: 2, textTransform: 'uppercase' },
  pillRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill:          { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4, maxWidth: '100%' },
  pillText:      { fontSize: 11, color: MUTED, maxWidth: 130 },
  pillMore:      { fontSize: 11, color: MUTED, alignSelf: 'center', paddingLeft: 4 },
  motivCard:     { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: ACCENT + '18', borderWidth: 1, borderColor: ACCENT + '33', borderRadius: 14, padding: 16, marginTop: 8 },
  motivText:     { flex: 1, fontSize: 14, color: TEXT, lineHeight: 20 },
});
