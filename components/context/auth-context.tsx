import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

interface User{
    id: string;
    name: string;
}
interface AuthContextProps {
    user: User | null;
    login: (username: string, password: string) => void;
    logout: () => void;
}

const EXPECTED_USERS = [
    { id: '1', name: 'user', password: '1234' },
    { id: '2', name: 'admin', password: 'admin' },
]

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (username: string, password: string) => {
        const foundUser = EXPECTED_USERS.find(
            (u) => u.name === username && u.password === password
        );  
        if (foundUser) {
            setUser({ id: foundUser.id, name: foundUser.name });
        }  else {
            Alert.alert('Login failed', 'Invalid username or password');
        }
    }; 

    const logout = () => {
        setUser(null);
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