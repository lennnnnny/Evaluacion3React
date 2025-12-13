import { Colors } from '@/constants/theme';
import { loadThemeFromStorage, saveThemeToStorage } from '@/utils/storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

type Scheme = Exclude<ColorSchemeName, 'no-preference'> | 'light' | 'dark';

interface ThemeContextValue {
  scheme: Scheme;
  colors: typeof Colors.light;
  toggleScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [scheme, setScheme] = useState<Scheme>(() => (systemScheme === 'dark' ? 'dark' : 'light'));

  useEffect(() => {
    loadThemeFromStorage().then(stored => {
      if (stored === 'dark' || stored === 'light') {
        setScheme(stored as Scheme);
        return;
      }
      if (systemScheme) setScheme(systemScheme === 'dark' ? 'dark' : 'light');
    })
  }, [systemScheme]);

  const toggleScheme = () => setScheme(s => (s === 'dark' ? 'light' : 'dark'));
  useEffect(() => {
    saveThemeToStorage(scheme);
  }, [scheme]);

  const value = useMemo(() => ({ scheme, colors: Colors[scheme], toggleScheme }), [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
