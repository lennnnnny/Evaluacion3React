import AuthProvider from '@/components/context/auth-context';
import ThemeProvider from '@/components/context/theme-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, UIManager } from 'react-native';
import 'react-native-reanimated';


export const unstable_settings = {
  anchor: 'login', //con anchor se define la pantalla inicial, en este caso es login
};

export default function RootLayout() {
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
 

  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </>
  );
}
