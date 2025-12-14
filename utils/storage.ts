import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@auth_token';
const THEME_PREF_KEY = '@theme_pref';

export const saveAuthToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
        console.error('Error saving auth token:', error);
    }
};

export const getAuthToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
        console.error('Error reading auth token:', error);
        return null;
    }
};

export const clearAuthToken = async () => {
    try {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
        console.error('Error clearing auth token:', error);
    }
};

export const saveThemeToStorage = async (scheme: string) => {
    try {
        await AsyncStorage.setItem(THEME_PREF_KEY, scheme);
    } catch (error) {
        console.error('Error saving theme to storage:', error);
    }
};

export const loadThemeFromStorage = async (): Promise<string | null> => {
    try {
        const scheme = await AsyncStorage.getItem(THEME_PREF_KEY);
        return scheme;
    } catch (error) {
        console.error('Error loading theme from storage:', error);
        return null;
    }
};