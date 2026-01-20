import { ThemeProvider as NextThemesProvider } from "next-themes";
export default function ThemesProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
