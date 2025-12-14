import { useAuth } from "@/components/context/auth-context";
import { useTheme } from '@/components/context/theme-context';
import Button from '@/components/ui/button';
import { IconSymbol } from "@/components/ui/icon-symbol";
import NewTask from "@/components/ui/new-task";
import TaskListItem from "@/components/ui/task-list.item";
import Title from "@/components/ui/title";
import { Task } from "@/constants/types";
import imageService from '@/services/image-service';
import getTodoService from '@/services/todo-services';
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, LayoutAnimation, Pressable, StyleSheet, TouchableOpacity } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";


//el safeareaview es para que no se sobreponga con la barra de estado del celular



//se debe componetizar para evitar que se convierta en un fat component
export default function TaskScreen() {
  const { user } = useAuth();
  const { colors, toggleScheme, scheme } = useTheme();
  const [todos, setTodos] = useState<Task[]>([]) ;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
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
  const todoClient = getTodoService();
  async function load() {
    if (!user) {
      setTodos([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await todoClient.getTodos();
      setTodos(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Error cargando tareas');
    } finally {
      setLoading(false);
    }
  }
  load();
}, [user]);

  // createTask removed: using addTodo with persistence instead

  const toggleTodo = (id: string) => {
    //utiliza el map para recorrer el array y cambiar el estado de completado
    //si el id de la tarea es igual al id pasado por parametro, cambia su estado de completado
    //si no, devuelve la tarea sin cambios
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // optimistic update + backend
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos(prevTodos => prevTodos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    (async () => {
      try {
        const todoClient = getTodoService();
        const target = todos.find(t => t.id === id);
        if (!target) return;
        await todoClient.patchTodo(id, { completed: !target.completed });
      } catch (err) {
        // revert on error
        setTodos(prevTodos => prevTodos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        Alert.alert('Error', 'No se pudo actualizar el estado de la tarea. Inténtalo de nuevo.');
      }
    })();
  }

  const handleNewTaskClose = () => {
    setCreatingNew(false);
    setEditingTask(null);
  }

  const removeTodo = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // optimistic remove + backend
    const prev = todos;
    const todoToDelete = prev.find(t => t.id === id);
    setTodos(prev.filter(t => t.id !== id));
    (async () => {
      try {
        const todoClient = getTodoService();
        await todoClient.deleteTodo(id);
        // if the todo had an uploaded image, attempt to delete it from the images service
        try {
          if (todoToDelete?.photoUri && todoToDelete.photoUri.startsWith('http')) {
            await imageService.deleteImageByUrl(todoToDelete.photoUri);
          }
        } catch (imgErr) {
          // ignore image deletion errors
          console.warn('Image delete failed', imgErr);
        }
      } catch (err) {
        // revert
        setTodos(prev);
        Alert.alert('Error', 'No se pudo eliminar la tarea. Inténtalo de nuevo.');
      }
    })();
  }

  function addTodo(task: Task) {
    if (task.title.trim().length === 0) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTodos((prevTodos) => {
      const taskWithUser = { ...task, userId: user ? user.id : task.userId };
      const updatedTodos = [...prevTodos, taskWithUser];
      return updatedTodos;
    });
    setCreatingNew(false);
  }

  const handleCreatedOrUpdated = (item: any) => {
    setTodos(prev => {
      const exists = prev.find(t => t.id === item.id);
      if (exists) {
        return prev.map(t => t.id === item.id ? item : t);
      }
      return [...prev, item];
    });
    setCreatingNew(false);
    setEditingTask(null);
  }

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setCreatingNew(true);
  }

  if (creatingNew) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <NewTask onClose={handleNewTaskClose} onTaskSave={handleCreatedOrUpdated} initialTask={editingTask} />
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
        
      {loading && (<Title> Cargando... </Title>)}
      {error && (
        <>
          <Title> Error: {error} </Title>
          <Button text='Reintentar' onPress={() => {
            setError(null);
            setLoading(true);
            const todoClient = getTodoService();
            todoClient.getTodos().then(res => setTodos(res.data || [])).catch(e => setError(e.message || 'Error cargando tareas')).finally(()=>setLoading(false));
          }} />
        </>
      )}
      {userTodos.map((todo) => (
        <TaskListItem 
        key={todo.id} 
        task={todo} 
        onToggle={toggleTodo} 
        onRemove={removeTodo} 
        onEdit={handleEdit} />
      ))} 
      <AnimatedPressable
        onPress={() => { setEditingTask(null); setCreatingNew(true); }}
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