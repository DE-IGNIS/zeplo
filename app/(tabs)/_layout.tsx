// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_ICON: Record<string, { focused: IoniconsName; unfocused: IoniconsName }> = {
  library:    { focused: "book",        unfocused: "book-outline"        },
  "add-book": { focused: "add-circle",  unfocused: "add-circle-outline"  },
  stats:      { focused: "bar-chart",   unfocused: "bar-chart-outline"   },
  profile:    { focused: "person",      unfocused: "person-outline"      },
};

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  const paddingBottom = Math.max(bottom, 12);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.outline,
        tabBarLabelStyle: {
          fontFamily: "WorkSans_600SemiBold",
          fontSize: 10,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.outlineVariant + "55",
          elevation: 0,
          shadowColor: Colors.onSurface,
          shadowOpacity: 0.06,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: -4 },
          height: 60 + paddingBottom,
          paddingBottom,
        },
        tabBarIcon: ({ focused, size }) => (
          <Ionicons
            name={focused ? TAB_ICON[route.name].focused : TAB_ICON[route.name].unfocused}
            size={size}
            color={focused ? Colors.primary : Colors.outline}
          />
        ),
      })}
    >
      <Tabs.Screen name="library"  options={{ title: "Library" }} />
      <Tabs.Screen name="add-book" options={{ title: "Add"     }} />
      <Tabs.Screen name="stats"    options={{ title: "Stats"   }} />
      <Tabs.Screen name="profile"  options={{ title: "Profile" }} />
    </Tabs>
  );
}