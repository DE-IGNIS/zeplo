// app/(tabs)/profile.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(auth)/sign-out")}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 24, color: "#1a1a1a", marginBottom: 32 },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: { fontFamily: "Inter_600SemiBold", color: "#fff", fontSize: 15 },
});