import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import Svg, { Line, Circle, Text as SvgText } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getBooks, type Book } from "@/lib/books";
import BookDetailSheet from "@/components/BookDetailSheet";
import { Colors, Fonts } from "@/constants/theme";
import React from "react";

const CENTER_RADIUS = 18;
const NODE_RADIUS = 28;
const ORBIT_RADIUS = 130;

function getNodePositions(count: number, cx: number, cy: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + ORBIT_RADIUS * Math.cos(angle),
      y: cy + ORBIT_RADIUS * Math.sin(angle),
    };
  });
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export default function LibraryScreen() {
  const { top } = useSafeAreaInsets();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const fetchBooks = async () => {
    setLoading(true);
    const { data } = await getBooks();
    setBooks(data);
    setLoading(false);
  };

  // Refetch every time the tab comes into focus
  // so new books added show up immediately
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const cx = layout.width / 2;
  const cy = layout.height / 2;
  const positions = getNodePositions(books.length, cx, cy);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: top }]}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>The Editorial Archive</Text>
          <Text style={styles.headerCount}>
            {books.length} {books.length === 1 ? "book" : "books"}
          </Text>
        </View>

        {/* Graph */}
        <View
          style={styles.canvas}
          onLayout={(e) =>
            setLayout({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.loader}
            />
          ) : books.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Your archive is empty.</Text>
              <Text style={styles.emptySubtitle}>
                Add your first book to begin.
              </Text>
            </View>
          ) : (
            layout.width > 0 && (
              <Svg width={layout.width} height={layout.height}>

                {/* Lines from center to each node */}
                {positions.map((pos, i) => (
                  <Line
                    key={`line-${i}`}
                    x1={cx}
                    y1={cy}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={Colors.outlineVariant}
                    strokeWidth={1.2}
                    strokeOpacity={0.6}
                  />
                ))}

                {/* Center hub */}
                <Circle
                  cx={cx}
                  cy={cy}
                  r={CENTER_RADIUS}
                  fill={Colors.primary}
                />
                <Circle
                  cx={cx}
                  cy={cy}
                  r={CENTER_RADIUS - 6}
                  fill={Colors.primaryContainer}
                />

                {/* Book nodes */}
                {books.map((book, i) => {
                  const pos = positions[i];
                  return (
                    <React.Fragment key={book.id}>
                      {/* Tap target */}
                      <Circle
                        cx={pos.x}
                        cy={pos.y}
                        r={NODE_RADIUS}
                        fill={Colors.surfaceContainerHigh}
                        stroke={Colors.primary}
                        strokeWidth={1.5}
                        onPress={() => setSelectedBook(book)}
                      />
                      {/* Rating number inside node */}
                      <SvgText
                        x={pos.x}
                        y={pos.y + 1}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize={13}
                        fontFamily={Fonts.labelSemiBold}
                        fill={Colors.primary}
                        onPress={() => setSelectedBook(book)}
                      >
                        {"★ " + book.rating}
                      </SvgText>
                      {/* Title label below node */}
                      <SvgText
                        x={pos.x}
                        y={pos.y + NODE_RADIUS + 14}
                        textAnchor="middle"
                        fontSize={10}
                        fontFamily={Fonts.label}
                        fill={Colors.onSurfaceVariant}
                        onPress={() => setSelectedBook(book)}
                      >
                        {truncate(book.title, 14)}
                      </SvgText>
                    </React.Fragment>
                  );
                })}
              </Svg>
            )
          )}
        </View>

        {/* Bottom sheet */}
        <BookDetailSheet
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: Fonts.headline,
    fontSize: 22,
    color: Colors.primary,
    fontStyle: "italic",
  },
  headerCount: {
    fontFamily: Fonts.label,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  canvas: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignSelf: "center",
    marginTop: "50%",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontFamily: Fonts.headline,
    fontSize: 20,
    color: Colors.onSurface,
    fontStyle: "italic",
  },
  emptySubtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
});