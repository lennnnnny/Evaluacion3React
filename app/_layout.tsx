import AuthProvider from '@/components/context/auth-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


export const unstable_settings = {
  anchor: 'login', //con anchor se define la pantalla inicial, en este caso es login
};

export default function RootLayout() {
 

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
