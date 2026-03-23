import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStats, type Stats } from "@/lib/books";
import { Colors, Fonts, Radius } from "@/constants/theme";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const BAR_WIDTH = 18;
const BAR_GAP = 8;
const CHART_HEIGHT = 160;
const CHART_PADDING_BOTTOM = 24;

function BarChart({
  monthly,
}: {
  monthly: { month: number; count: number }[];
}) {
  const maxCount = Math.max(...monthly.map((m) => m.count), 1);
  const chartWidth = monthly.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

  return (
    <Svg width={chartWidth} height={CHART_HEIGHT + CHART_PADDING_BOTTOM}>
      {monthly.map((m, i) => {
        const barHeight = Math.max(
          (m.count / maxCount) * CHART_HEIGHT,
          m.count > 0 ? 4 : 0,
        );
        const x = i * (BAR_WIDTH + BAR_GAP);
        const y = CHART_HEIGHT - barHeight;

        return (
          <React.Fragment key={m.month}>
            {/* Bar */}
            <Rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={barHeight}
              rx={4}
              fill={m.count > 0 ? Colors.primary : Colors.surfaceContainerHigh}
            />
            {/* Count above bar */}
            {m.count > 0 && (
              <SvgText
                x={x + BAR_WIDTH / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize={9}
                fontFamily={Fonts.labelSemiBold}
                fill={Colors.onSurfaceVariant}
              >
                {m.count}
              </SvgText>
            )}
            {/* Month label below bar */}
            <SvgText
              x={x + BAR_WIDTH / 2}
              y={CHART_HEIGHT + CHART_PADDING_BOTTOM - 4}
              textAnchor="middle"
              fontSize={9}
              fontFamily={Fonts.label}
              fill={Colors.outline}
            >
              {MONTHS[m.month - 1]}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const { top } = useSafeAreaInsets();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        setLoading(true);
        const { data } = await getStats();
        setStats(data);
        if (data && data.byYear.length > 0) {
          setSelectedYear(data.byYear[data.byYear.length - 1].year);
        }
        setLoading(false);
      };
      fetch();
    }, []),
  );

  const selectedYearData = stats?.byYear.find((y) => y.year === selectedYear);

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={[styles.scroll, { paddingTop: top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Numbers</Text>
        <Text style={styles.headerSubtitle}>
          Not all those who wander are lost — but do track what you read.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 60 }}
        />
      ) : !stats || stats.totalBooks === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No data yet.</Text>
          <Text style={styles.emptySubtitle}>
            Add some books to see your stats.
          </Text>
        </View>
      ) : (
        <>
          {/* Stat cards */}
          <View style={styles.cardRow}>
            <StatCard label="Books Read" value={stats.totalBooks} />
            <StatCard
              label="Favourite Genre"
              value={
                stats.favouriteGenre
                  ? stats.favouriteGenre.charAt(0).toUpperCase() +
                    stats.favouriteGenre.slice(1)
                  : "—"
              }
            />
          </View>

          {/* Chart section */}
          {stats.byYear.length > 0 && (
            <View style={styles.chartCard}>
              {/* Year selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.yearSelector}
              >
                {stats.byYear.map((y) => {
                  const active = y.year === selectedYear;
                  return (
                    <TouchableOpacity
                      key={y.year}
                      style={[styles.yearPill, active && styles.yearPillActive]}
                      onPress={() => setSelectedYear(y.year)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.yearPillText,
                          active && styles.yearPillTextActive,
                        ]}
                      >
                        {y.year}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Chart label */}
              <Text style={styles.chartLabel}>Books per month</Text>

              {/* Bar chart */}
              {selectedYearData && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chartScroll}
                >
                  <BarChart monthly={selectedYearData.monthly} />
                </ScrollView>
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  headerTitle: {
    fontFamily: Fonts.headline,
    fontSize: 42,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: "italic",
    textAlign: "center",
    opacity: 0.8,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    padding: 20,
    gap: 6,
    shadowColor: Colors.onSurface,
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statValue: {
    fontFamily: Fonts.headline,
    fontSize: 32,
    color: Colors.primary,
  },
  statLabel: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  chartCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    padding: 20,
    gap: 16,
    shadowColor: Colors.onSurface,
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  yearSelector: {
    flexDirection: "row",
    gap: 8,
  },
  yearPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  yearPillActive: {
    backgroundColor: Colors.primary,
  },
  yearPillText: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  yearPillTextActive: {
    color: Colors.onPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: Fonts.headline,
    fontSize: 22,
    color: Colors.onSurface,
    fontStyle: "italic",
  },
  emptySubtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: "italic",
  },
  chartLabel: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  chartScroll: {
    paddingVertical: 8,
  },
});
