import { useAuth } from '@/components/context/auth-context';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default function ProfileScreen() {

  const { user, logout } = useAuth();

  const router = useRouter();


  const handleLogout = () => {
    logout();
    router.replace('/login');
  }

  console.log("Rendering ProfileScreen with user:", user);

  //en el return se define la estructura de la pantalla home screen

  //los estilos se definen dentro de los <> con style= seguido del nombre del estilo, ademas se les asigna la propiedad onPress con el nombre de la función que se va a ejecutar
  //los botones se manejan con la etiqueta <Pressable> y se le asigna la función onPress que se va a ejecutar al presionarlo
  //el modal se abre con un enlace que usa la etiqueta <Link> y se le asigna la ruta del modal en el atributo href
  return (
      <View style={styles.container}>  
        <Text style={styles.titleText}>Hola!, {user?.name}</Text>
        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.textColor} >Logout</Text>
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
  },
    textColor:{
    color: '#fff',
  },
  titleText:{
    color: '#000000ff',
    fontSize: 40,
    fontWeight: 'bold',
  }
});
