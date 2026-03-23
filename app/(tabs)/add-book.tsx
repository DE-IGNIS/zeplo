import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { addBook } from "@/lib/books";
import { Colors, Fonts, Radius } from "@/constants/theme";

const EMPTY_FORM = {
  title: "",
  author: "",
  genre: "",
  rating: 0,
  review: "",
};

export default function AddBookScreen() {
  const { top } = useSafeAreaInsets();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      return Alert.alert("Missing fields", "Title and author are required.");
    }
    if (form.rating === 0) {
      return Alert.alert(
        "Missing rating",
        "Please give the book a star rating.",
      );
    }

    setLoading(true);
    const { error } = await addBook({
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim() || null,
      rating: form.rating,
      review: form.review.trim() || null,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error);
    } else {
      setForm(EMPTY_FORM);
      Alert.alert("Saved", `"${form.title}" added to your library.`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: top + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Chapter</Text>
          <Text style={styles.headerSubtitle}>
            ```A reader lives a thousand lives before he dies.```
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Book Title</Text>
            <TextInput
              style={styles.inputLarge}
              placeholder="e.g. The Shadow of the Wind"
              placeholderTextColor={Colors.outlineVariant}
              value={form.title}
              onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Author</Text>
              <TextInput
                style={styles.input}
                placeholder="Author name"
                placeholderTextColor={Colors.outlineVariant}
                value={form.author}
                onChangeText={(v) => setForm((f) => ({ ...f, author: v }))}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Genre</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Fiction"
                placeholderTextColor={Colors.outlineVariant}
                value={form.genre}
                onChangeText={(v) => setForm((f) => ({ ...f, genre: v }))}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Rating</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setForm((f) => ({ ...f, rating: star }))}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={star <= form.rating ? "star" : "star-outline"}
                    size={32}
                    color={
                      star <= form.rating
                        ? Colors.primary
                        : Colors.outlineVariant
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Review</Text>
            <TextInput
              style={styles.textArea}
              placeholder="What did you think of this book?"
              placeholderTextColor={Colors.outlineVariant}
              value={form.review}
              onChangeText={(v) => setForm((f) => ({ ...f, review: v }))}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.buttonText}>Add to Library</Text>
                <Ionicons name="book" size={16} color={Colors.onPrimary} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    padding: 24,
    gap: 24,
    shadowColor: Colors.onSurface,
    shadowOpacity: 0.04,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginLeft: 2,
  },
  inputLarge: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.headline,
    fontSize: 18,
    color: Colors.onSurface,
  },
  input: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.onSurface,
  },
  stars: {
    flexDirection: "row",
    gap: 8,
    paddingLeft: 2,
  },
  textArea: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.onSurface,
    minHeight: 120,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 15,
    color: Colors.onPrimary,
  },
});
