import { Task } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../components/context/auth-context';

const TODOS_STORAGE_KEY_BASE = '@todos_storage';
const SESSION_STORAGE_KEY = '@session_storage'
const THEME_PREF_KEY = '@theme_pref'

export const saveTodosToStorage = async (todos: Task[], userId?: string) => {
    try {
        const stringifiedTodos = JSON.stringify(todos);
        const key = userId ? `${TODOS_STORAGE_KEY_BASE}:${userId}` : TODOS_STORAGE_KEY_BASE;
        await AsyncStorage.setItem(key, stringifiedTodos);
    } catch (error) {
        console.error('Error saving todos to storage:', error);
    }
}

export const loadTodosFromStorage = async (userId?: string): Promise<Task[]> => {
    try {
        const key = userId ? `${TODOS_STORAGE_KEY_BASE}:${userId}` : TODOS_STORAGE_KEY_BASE;
        const storedTodos = await AsyncStorage.getItem(key);
        if (storedTodos) {
            return JSON.parse(storedTodos);
        }
        // migration: if no per-user key found & userId provided, try read from global key and filter
        if (userId) {
            const globalStored = await AsyncStorage.getItem(TODOS_STORAGE_KEY_BASE);
            if (globalStored) {
                try {
                    const parsedGlobal = JSON.parse(globalStored) as Task[];
                    if (Array.isArray(parsedGlobal)) {
                        const filtered = parsedGlobal.filter(t => t.userId === userId);
                        // save filtered to per-user key
                        const userKey = `${TODOS_STORAGE_KEY_BASE}:${userId}`;
                        await AsyncStorage.setItem(userKey, JSON.stringify(filtered));
                        return filtered;
                    }
                } catch {
                    // ignore parse errors and fall through to empty array
                }
            }
        }
        return [];
    } catch (error) {
        console.error('Error loading todos from storage:', error);
        return [];
    }   
}

export const saveSessionToStorage = async (sessionData: User) => {
    try {
        const stringifiedSession = JSON.stringify(sessionData);
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, stringifiedSession);
    } catch (error) {
        console.error('Error saving session to storage:', error);
    }
}

export const loadSessionFromStorage = async (): Promise<User | null> => {
    try {
        const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (storedSession) {
            return JSON.parse(storedSession);
        }   
        return null;
    } catch (error) {
        console.error('Error loading session from storage:', error);
        return null;
    }   
}

export const clearSessionFromStorage = async () => {
    try {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing session from storage:', error);
    }
}

export const saveThemeToStorage = async (scheme: string) => {
    try {
        await AsyncStorage.setItem(THEME_PREF_KEY, scheme);
    } catch (error) {
        console.error('Error saving theme to storage:', error);
    }
}

export const loadThemeFromStorage = async (): Promise<string | null> => {
    try {
        const scheme = await AsyncStorage.getItem(THEME_PREF_KEY);
        return scheme;
    } catch (error) {
        console.error('Error loading theme from storage:', error);
        return null;
    }
}