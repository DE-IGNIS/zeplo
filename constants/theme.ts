// constants/theme.ts
export const Colors = {
  background:           "#fff9eb",
  surface:              "#fff9eb",
  surfaceContainerLow:  "#faf3e0",
  surfaceContainer:     "#f4eedb",
  surfaceContainerHigh: "#efe8d5",
  surfaceContainerHighest: "#e9e2d0",
  surfaceContainerLowest: "#ffffff",

  primary:              "#6f4627",
  primaryContainer:     "#8b5e3c",
  onPrimary:            "#ffffff",

  onSurface:            "#1e1c10",
  onSurfaceVariant:     "#51443c",
  outline:              "#83746b",
  outlineVariant:       "#d5c3b8",
} as const;

export const Fonts = {
  headline: "NotoSerif_700Bold_Italic",
  headlineRegular: "NotoSerif_400Regular",
  body: "Newsreader_400Regular",
  label: "WorkSans_400Regular",
  labelMedium: "WorkSans_500Medium",
  labelSemiBold: "WorkSans_600SemiBold",
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;