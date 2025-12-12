import { IconSymbol } from "@/components/ui/icon-symbol";
import TaskListItem from "@/components/ui/task-list.item";
import Title from "@/components/ui/title";
import { Task } from "@/constants/types";
import { generateRandomId } from "@/utils/generate-random-id";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//array mock de tareas .
const initialTodos = [
  { id: generateRandomId(), title: 'Comprar víveres', completed: false },
  { id: generateRandomId(), title: 'Llevar el auto al taller', completed: true },
  { id: generateRandomId(), title: 'Pagar las facturas', completed: false },
]
//el safeareaview es para que no se sobreponga con la barra de estado del celular



//se debe componetizar para evitar que se convierta en un fat component
export default function HomeScreen() {
  const [todos, setTodos] = useState<Task[]>(initialTodos) ;
  const [creatingNew, setCreatingNew] = useState<boolean>(false);
  const toggleTodo = (id: string) => {
    //utiliza el map para recorrer el array y cambiar el estado de completado
    //si el id de la tarea es igual al id pasado por parametro, cambia su estado de completado
    //si no, devuelve la tarea sin cambios
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  const removeTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }

  if (creatingNew) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{marginBottom: 20}}>
          <Title> Nueva Tarea </Title>
        </View>
        <TouchableOpacity 
          style={styles.newTaskButton} 
          onPress={() => setCreatingNew(false)}>
          <IconSymbol name="plus" size={30} color="#fff" />
          <Text style={{ color: '#fff', textAlign: 'center' }}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const addTodo = (title: string) => {
    const cleaned = title.trim();
    if (!cleaned) return;
    const newTodo: Task = {
      id: generateRandomId(),
      title: cleaned,
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
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
      <TouchableOpacity 
        style={styles.newTaskButton} 
        onPress={() => setCreatingNew(true)}>
        <IconSymbol name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
  // key es para que react identifique cada elemento de la lista
  // cada tarea es un view con un circulo y el titulo
  // key ayuda con el renderizado en frio, para cargar todo el componente de nuevo
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 20,
  },
  newTaskButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
  }
});