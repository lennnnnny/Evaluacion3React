import Title from "@/components/ui/title";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//array mock de tareas .
const todos = [
  { id: 1, title: 'Comprar víveres', completed: false },
  { id: 2, title: 'Llevar el auto al taller', completed: true },
  { id: 3, title: 'Pagar las facturas', completed: false },
]
//el safeareaview es para que no se sobreponga con la barra de estado del celular

//se debe componetizar para evitar que se convierta en un fat component
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Title>  
        Lista de Tareas
      </Title> 
      {todos.map((todo) => (
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 20,
  },
});