import TaskListItem from "@/components/ui/task-list.item";
import Title from "@/components/ui/title";
import { Task } from "@/constants/types";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//array mock de tareas .
const initialTodos = [
  { id: 1, title: 'Comprar víveres', completed: false },
  { id: 2, title: 'Llevar el auto al taller', completed: true },
  { id: 3, title: 'Pagar las facturas', completed: false },
]
//el safeareaview es para que no se sobreponga con la barra de estado del celular

//se debe componetizar para evitar que se convierta en un fat component
export default function HomeScreen() {
  const [todos, setTodos] = useState<Task[]>(initialTodos) ;
  const toggleTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  const removeTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }
  return (
    <SafeAreaView style={styles.container}>
      <Title>  
        Lista de Tareas
      </Title> 
        
      {todos.map((todo) => (
        <TaskListItem 
        key={todo.id} 
        task={todo} 
        onToggle={toggleTodo} 
        onRemove={removeTodo} />
      ))} 
    </SafeAreaView>
    //key es para que react identifique cada elemento de la lista
         //cada tarea es un view con un circulo y el titulo
         //key ayuda con el renderizado en frio, para cargar todo el componente de nuevo
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