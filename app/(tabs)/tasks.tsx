import { useAuth } from "@/components/context/auth-context";
import { useTheme } from '@/components/context/theme-context';
import { IconSymbol } from "@/components/ui/icon-symbol";
import NewTask from "@/components/ui/new-task";
import TaskListItem from "@/components/ui/task-list.item";
import Title from "@/components/ui/title";
import { Task } from "@/constants/types";
import { loadTodosFromStorage, saveTodosToStorage } from "@/utils/storage";
import React, { useEffect, useRef, useState } from "react";
import { Animated, LayoutAnimation, Pressable, StyleSheet, TouchableOpacity } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";


//el safeareaview es para que no se sobreponga con la barra de estado del celular



//se debe componetizar para evitar que se convierta en un fat component
export default function TaskScreen() {
  const { user } = useAuth();
  const { colors, toggleScheme, scheme } = useTheme();
  const [todos, setTodos] = useState<Task[]>([]) ;
  const [creatingNew, setCreatingNew] = useState<boolean>(false);
  const userTodos = todos; // todos will be loaded per user
  const fabScale = useRef(new Animated.Value(1)).current;
  function handleFabPressIn() {
    Animated.spring(fabScale, { toValue: 0.96, useNativeDriver: true }).start();
  }
  function handleFabPressOut() {
    Animated.spring(fabScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  }
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
useEffect (() => {
  if (!user) {
    setTodos([]);
    return;
  }
  loadTodosFromStorage(user.id)
    .then(loadedTodos => {
      setTodos(loadedTodos);
    });
}, [user]);

  // createTask removed: using addTodo with persistence instead

  const toggleTodo = (id: string) => {
    //utiliza el map para recorrer el array y cambiar el estado de completado
    //si el id de la tarea es igual al id pasado por parametro, cambia su estado de completado
    //si no, devuelve la tarea sin cambios
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      if (user) saveTodosToStorage(updatedTodos, user.id);
      return updatedTodos;
    });
  }

  const handleNewTaskClose = () => {
    setCreatingNew(false);
  }

  const removeTodo = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.filter(todo => todo.id !== id);
      if (user) saveTodosToStorage(updatedTodos, user.id);
      return updatedTodos;
    });
  }

  function addTodo(task: Task) {
    if (task.title.trim().length === 0) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos((prevTodos) => {
      const taskWithUser = { ...task, userId: user ? user.id : task.userId };
      const updatedTodos = [...prevTodos, taskWithUser];
      if (user) saveTodosToStorage(updatedTodos, user.id);
      return updatedTodos;
    });
    setCreatingNew(false);
  }

  if (creatingNew) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <NewTask onClose={handleNewTaskClose} onTaskSave={addTodo} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Title>  
        Lista de Tareas
      </Title> 
      <TouchableOpacity onPress={toggleScheme} style={{ position: 'absolute', right: 14, top: 10 }}>
        <IconSymbol name={scheme === 'dark' ? 'sun.max' : 'moon'} size={20} color={colors.icon} />
      </TouchableOpacity>
        
      {userTodos.map((todo) => (
        <TaskListItem 
        key={todo.id} 
        task={todo} 
        onToggle={toggleTodo} 
        onRemove={removeTodo} />
      ))} 
      <AnimatedPressable
        onPress={() => setCreatingNew(true)}
        onPressIn={handleFabPressIn}
        onPressOut={handleFabPressOut}
        style={[{ transform: [{ scale: fabScale }] }, styles.newTaskButton, { backgroundColor: colors.tint } as any]}
        accessibilityRole="button"
      >
        {
          // Ensure icon contrasts with the button background (dark/light)
        }
        <IconSymbol name="plus" size={30} color={scheme === 'dark' ? colors.background : '#fff'} />
      </AnimatedPressable>
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
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }
});