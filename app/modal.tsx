import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

//acá se define el componente ModalScreen que es la pantalla modal que se abre desde el home screen 
//y que contiene un enlace para volver al home screen 
//los estilos se definen al final del archivo con StyleSheet.create
//la propiedad dismissTo en el enlace indica que al hacer clic en el enlace se debe cerrar la pantalla modal y volver a la pantalla anterior
export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text>This is a modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.title}>Go back to home screen</Text>
      </Link>
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
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  title:{
    marginTop: 20,
    color: '#007AFF',
  }
});
