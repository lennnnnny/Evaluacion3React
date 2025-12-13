import getAuthService from '@/services/auth-service';
import { clearSessionFromStorage, loadSessionFromStorage, saveSessionToStorage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';







export interface User{
    id: string;
    name: string;
}
interface AuthContextProps {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    useEffect(() => {
        loadSessionFromStorage()
        .then((storedUser) => {
            if (storedUser) {
                setUser(storedUser);
            }
        })
    }, []);

    useEffect(() => {
        if (user) {
            router.replace( '/(tabs)');
        }
        
    }, [user, router]);

    const login = async (email: string, password: string) => {
        const authClient = getAuthService();
        try {
            const loginData = await authClient.login({email:email, password:password});
            console.log("Login exitoso:", loginData);
            saveSessionToStorage(loginData.data);
            setUser(loginData.data.user);
        } catch (error) {
            Alert.alert("Error de auntenticación", (error as Error).message);
        }
    };

    const logout = () => {
        setUser(null);
        clearSessionFromStorage();
    }

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);     //cuando se utilice dentro de un componente dentro de este contexto AuthProvider, si esta fuera de este contexto, context será undefined
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }       
    return context;
}