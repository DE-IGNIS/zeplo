// app/(auth)/sign-out.tsx
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";

export default function SignOut() {
  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1a1a1a" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f7f4",
  },
});