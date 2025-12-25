import getTodoService, { TodoItem, TodoPayload } from '@/services/todo-services';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export interface UseTodosReturn {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  loadTodos: () => Promise<void>;
  createTodo: (payload: TodoPayload) => Promise<void>;
  updateTodo: (id: string, payload: TodoPayload) => Promise<void>;
  patchTodo: (id: string, payload: Partial<TodoPayload>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const todoClient = getTodoService();
      const res = await todoClient.getTodos();
      setTodos(res.data || []);
    } catch (err: any) {
      const errorMessage = err.message || 'Error cargando tareas';
      setError(errorMessage);
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (payload: TodoPayload) => {
    try {
      const todoClient = getTodoService();
      const res = await todoClient.createTodo(payload);
      setTodos(prev => [...prev, res.data]);
    } catch (err: any) {
      const errorMessage = err.message || 'Error creando tarea';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id: string, payload: TodoPayload) => {
    try {
      const todoClient = getTodoService();
      const res = await todoClient.updateTodo(id, payload);
      setTodos(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err: any) {
      const errorMessage = err.message || 'Error actualizando tarea';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw err;
    }
  }, []);

  const patchTodo = useCallback(async (id: string, payload: Partial<TodoPayload>) => {
    try {
      const todoClient = getTodoService();
      const res = await todoClient.patchTodo(id, payload);
      setTodos(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err: any) {
      const errorMessage = err.message || 'Error actualizando tarea';
      setError(errorMessage);
      console.error('Error patching todo:', err);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const todoClient = getTodoService();
      await todoClient.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Error eliminando tarea';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    
    // Optimistic update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    
    try {
      const todoClient = getTodoService();
      await todoClient.patchTodo(id, { completed: !target.completed });
    } catch {
      // Revert on error
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      Alert.alert('Error', 'No se pudo actualizar el estado de la tarea. Inténtalo de nuevo.');
    }
  }, [todos]);

  return {
    todos,
    loading,
    error,
    loadTodos,
    createTodo,
    updateTodo,
    patchTodo,
    deleteTodo,
    toggleTodo,
  };
}
