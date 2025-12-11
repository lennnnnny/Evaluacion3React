import { useAuth } from '@/components/context/auth-context';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
   //acá definimos una constante de nombre count, una fuincion llamada setCount y se asigna el valor inicial 0
   //en react se usa useState para definir estados
  const [count, setCount] = useState(0);
  //acá se define otra constante de nombre open y nombre de funcion setOpen con valor inicial false
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();

  const router = useRouter();

  //acá se define la función handleIncrement para incrementar el valor del contador
  const handleIncrement = () => {
    setCount(count + 1);
  }

  //acá se define una funcion de nombre handleToggle para cambiar el valor de open
  const handleToggle = () => {
    setOpen(!open); //el operador ! invierte el valor de open
  }

  const handleLogout = () => {
    logout();
    router.replace('/login');
  }

  //en el return se define la estructura de la pantalla home screen

  //los estilos se definen dentro de los <> con style= seguido del nombre del estilo, ademas se les asigna la propiedad onPress con el nombre de la función que se va a ejecutar
  //los botones se manejan con la etiqueta <Pressable> y se le asigna la función onPress que se va a ejecutar al presionarlo
  //el modal se abre con un enlace que usa la etiqueta <Link> y se le asigna la ruta del modal en el atributo href
  return (
    <View style={styles.container}>  
      <Text>Hello, World!</Text>
      <Text>This is a counter: {count}</Text>
      <Pressable style={styles.button} onPress={handleIncrement}>
        <Text>Increment</Text>
      </Pressable>
      <Text>The toggle is {open ? 'Open' : 'Closed'}</Text>
      <Pressable style={styles.button} onPress={handleToggle}>
        <Text>Toggle</Text>
      </Pressable>
      <Text>Hola {user?.name}</Text>
      <Link href="/modal" style={styles.button}>
        <Text>Open Modal</Text>
      </Link> 
      <Link href="/login" style={styles.button}>
        <Text>Go to Login</Text>
      </Link>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({ //acá se definen los estilos
  container: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    color: '#fff',
    
  }
});
