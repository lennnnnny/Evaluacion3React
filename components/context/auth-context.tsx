import { setUnauthorizedHandler } from '@/services/api';
import getAuthService from '@/services/auth-service';
import { clearAuthToken, getAuthToken, saveAuthToken } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface User{
    id: string;
    name: string;
    token: string;
}
interface AuthContextProps {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const decodeJwtFn = (jwtDecode as any).default ? (jwtDecode as any).default : jwtDecode;
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setUnauthorizedHandler(() => {
            logout();
        });

        getAuthToken()
        .then((token) => {
            if (token) {
                try {
                    const decoded = decodeJwtFn(token) as { sub: string };
                    const u: User = { id: decoded.sub, name: decoded.sub, token };
                    setUser(u);
                } catch (e) {
                    // invalid token
                    setUser(null);
                }
            }
        })
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (user) {
            router.replace( '/(tabs)');
        }
        
    }, [user, router]);

    const login = async (email: string, password: string) => {
        const authClient = getAuthService();
        setLoading(true);
        try {
            const loginData = await authClient.login({email:email, password:password});
            const token = loginData.data.token;
            const userId = loginData.data.user.id;
            const userEmail = loginData.data.user.email;
            const decodedToken = decodeJwtFn(token) as { sub: string };
            const u: User = { id: userId, name: userEmail, token };
            setUser(u);
            await saveAuthToken(token);
            console.log('Login Successful', decodedToken);
        } catch (error) {
            Alert.alert("Error de auntenticación", (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        clearAuthToken();
        router.replace('/login');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading}}>
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