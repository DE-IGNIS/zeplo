// components/BookDetailSheet.tsx
import { useCallback, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts, Radius } from "@/constants/theme";
import type { Book } from "@/lib/books";

type Props = {
  book: Book | null;
  onClose: () => void;
};

export default function BookDetailSheet({ book, onClose }: Props) {
  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (book) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [book]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={["55%"]}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        {book && (
          <>
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {book.title}
            </Text>

            {/* Author + Genre row */}
            <View style={styles.meta}>
              <Text style={styles.author}>{book.author}</Text>
              {book.genre ? (
                <>
                  <Text style={styles.dot}>·</Text>
                  <View style={styles.genrePill}>
                    <Text style={styles.genreText}>{book.genre}</Text>
                  </View>
                </>
              ) : null}
            </View>

            {/* Star rating */}
            {book.rating && (
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= book.rating! ? "star" : "star-outline"}
                    size={20}
                    color={star <= book.rating! ? Colors.primary : Colors.outlineVariant}
                  />
                ))}
              </View>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Review */}
            {book.review ? (
              <Text style={styles.review}>{book.review}</Text>
            ) : (
              <Text style={styles.noReview}>No review written.</Text>
            )}
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.surfaceContainerLow,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    backgroundColor: Colors.outlineVariant,
    width: 40,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 12,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 4,
  },
  title: {
    fontFamily: Fonts.headline,
    fontSize: 28,
    color: Colors.onSurface,
    lineHeight: 36,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  author: {
    fontFamily: Fonts.labelMedium,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  dot: {
    color: Colors.outlineVariant,
    fontSize: 16,
  },
  genrePill: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.xl,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  genreText: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stars: {
    flexDirection: "row",
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant + "55",
    marginVertical: 4,
  },
  review: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    lineHeight: 26,
    fontStyle: "italic",
  },
  noReview: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.outlineVariant,
    fontStyle: "italic",
  },
});