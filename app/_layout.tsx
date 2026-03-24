import "react-native-gesture-handler"; // must be first import
import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  NotoSerif_400Regular,
  NotoSerif_700Bold_Italic,
} from "@expo-google-fonts/noto-serif";
import { Newsreader_400Regular } from "@expo-google-fonts/newsreader";
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
} from "@expo-google-fonts/work-sans";
import { supabase } from "../lib/supabase";
import * as Font from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  const [fontsLoaded] = useFonts({
    NotoSerif_400Regular,
    NotoSerif_700Bold_Italic,
    Newsreader_400Regular,
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitialized(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized || !fontsLoaded) return;
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";
    if (session && inAuthGroup) {
      router.replace("/(tabs)/library");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    }
  }, [session, initialized, fontsLoaded, segments, router]);

  if (!initialized || !fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff9eb" />
      <Slot />
    </>
  );
}
