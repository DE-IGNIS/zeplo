import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { Colors, Fonts, Radius } from "@/constants/theme";
import Constants from "expo-constants";

const GOAL_KEY = "reading_goal";

export default function ProfileScreen() {
  const { top } = useSafeAreaInsets();
  const [email, setEmail] = useState<string | null>(null);
  const [goal, setGoal] = useState<string>("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState("");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setEmail(session?.user?.email ?? null);

        const saved = await AsyncStorage.getItem(GOAL_KEY);
        if (saved) setGoal(saved);
      };
      load();
    }, [])
  );

  const handleSaveGoal = async () => {
    const parsed = parseInt(tempGoal);
    if (isNaN(parsed) || parsed <= 0) {
      return Alert.alert("Invalid goal", "Please enter a number greater than 0.");
    }
    await AsyncStorage.setItem(GOAL_KEY, String(parsed));
    setGoal(String(parsed));
    setEditingGoal(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => router.replace("/(auth)/sign-out"),
      },
    ]);
  };

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scroll, { paddingTop: top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          A readers life is never ordinary.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardSectionLabel}>Account</Text>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {email ? email[0].toUpperCase() : "?"}
            </Text>
          </View>
          <View style={styles.emailBlock}>
            <Text style={styles.emailLabel}>Signed in as</Text>
            <Text style={styles.emailText} numberOfLines={1}>
              {email ?? "—"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardSectionLabel}>Reading Goal</Text>
        <Text style={styles.goalDescription}>
          How many books do you want to read this year?
        </Text>

        {editingGoal ? (
          <View style={styles.goalEditRow}>
            <TextInput
              style={styles.goalInput}
              value={tempGoal}
              onChangeText={setTempGoal}
              keyboardType="number-pad"
              placeholder="e.g. 12"
              placeholderTextColor={Colors.outlineVariant}
              autoFocus
            />
            <TouchableOpacity
              style={styles.goalSaveButton}
              onPress={handleSaveGoal}
              activeOpacity={0.85}
            >
              <Text style={styles.goalSaveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.goalCancelButton}
              onPress={() => setEditingGoal(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.goalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.goalDisplay}
            onPress={() => {
              setTempGoal(goal);
              setEditingGoal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.goalNumber}>
              {goal ? goal : "—"}
            </Text>
            <Text style={styles.goalUnit}>
              {goal ? `book${parseInt(goal) === 1 ? "" : "s"} this year` : "Tap to set a goal"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardSectionLabel}>App</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Version</Text>
          <Text style={styles.infoValue}>{appVersion}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoKey}>Built with</Text>
          <Text style={styles.infoValue}>Expo + Supabase</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.85}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>

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
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
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
    padding: 20,
    gap: 12,
    shadowColor: Colors.onSurface,
    shadowOpacity: 0.04,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardSectionLabel: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: Fonts.headline,
    fontSize: 20,
    color: Colors.onPrimary,
  },
  emailBlock: {
    flex: 1,
    gap: 2,
  },
  emailLabel: {
    fontFamily: Fonts.label,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emailText: {
    fontFamily: Fonts.labelMedium,
    fontSize: 14,
    color: Colors.onSurface,
  },
  goalDescription: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: "italic",
  },
  goalDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  goalNumber: {
    fontFamily: Fonts.headline,
    fontSize: 48,
    color: Colors.primary,
    lineHeight: 56,
  },
  goalUnit: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    fontStyle: "italic",
  },
  goalEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  goalInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: Fonts.headline,
    fontSize: 24,
    color: Colors.onSurface,
  },
  goalSaveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  goalSaveText: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 13,
    color: Colors.onPrimary,
  },
  goalCancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  goalCancelText: {
    fontFamily: Fonts.labelMedium,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + "44",
    paddingBottom: 10,
  },
  infoKey: {
    fontFamily: Fonts.label,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  infoValue: {
    fontFamily: Fonts.labelMedium,
    fontSize: 14,
    color: Colors.onSurface,
  },
  signOutButton: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.outlineVariant + "66",
  },
  signOutText: {
    fontFamily: Fonts.labelSemiBold,
    fontSize: 15,
    color: "#ba1a1a",
  },
});