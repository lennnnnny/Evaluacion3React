import { useAuth } from '@/components/context/auth-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View, } from 'react-native';

export default function LoginScreen() {
  // Estados para almacenar el nombre de usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth();
  
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
  const handleLogin = () => {
    // lógica implementada para user y 1234
     try {
      login(username, password);
      router.replace('/(tabs)'); // Navegar a la pantalla principal después del login exitoso
    } catch (error) {
      Alert.alert('Login failed', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputContainer}>Login Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Username o Email"
        placeholderTextColor="#615b5bff"
        onChangeText={handleUsernameChange}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#615b5bff"
        secureTextEntry
        onChangeText={handlePasswordChange}
        value={password}
      />
      
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text>Login</Text>
      </Pressable>
    </View>
    
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
  button: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#5c449fff',
    borderRadius: 5,
  },
}); 