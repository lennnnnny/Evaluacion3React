import { useAuth } from '@/components/context/auth-context';
import { useTheme } from '@/components/context/theme-context';
import Button from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function LoginScreen() {
  // Estados para almacenar el nombre de usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login, loading} = useAuth();
  const { colors, scheme } = useTheme();

  // Hook para la navegación
  const router = useRouter();

  // Funciones para manejar los cambios en los campos de texto
  const handleUsernameChange = (text: string) => {
    setUsername(text);
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  }

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      await login(username, password);
      // let AuthProvider perform navigation when user is set
    } catch (error) {
      Alert.alert('Login failed', (error as Error).message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1, backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <Text style={[styles.inputContainer, { color: colors.text }]}>Login Screen</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.icon, backgroundColor: scheme === 'dark' ? '#2a2a2a' : '#f7f7f7', color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.icon}
              onChangeText={handleUsernameChange}
              value={username}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
            />
            <TextInput
              style={[styles.input, { borderColor: colors.icon, backgroundColor: scheme === 'dark' ? '#2a2a2a' : '#f7f7f7', color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.icon}
              secureTextEntry
              onChangeText={handlePasswordChange}
              value={password}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
            />

            <Button text= 'Login' style={styles.button} onPress={handleLogin} disabled={loading}/>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,   
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000', 
    width: '80%',
    marginTop: 80,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000', 
    marginTop: 8
  },
  input: {
    fontSize: 16,
    borderColor: '#2e127dff',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    padding: 20,
    width: '100%',
    backgroundColor: '#f7f7f7', // o '#f7f7f7' si el contenedor es blanco
    color: '#000', 
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#5c449fff',
    borderRadius: 5,
    width: '100%',
  },
}); 