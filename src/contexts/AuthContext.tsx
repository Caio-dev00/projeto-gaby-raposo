import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebaseConnection";

interface AuthProviderProps {
    children: ReactNode;
}

interface UserProps {
    uid: string;
    name: string | null;
    email: string | null;
}

interface AuthContextData {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: (user: UserProps) => void;
    user: UserProps | null;
    logOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email
                });
            } else {
                setUser(null);
            }
            setLoadingAuth(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleInfoUser = (user: UserProps) => {
        setUser(user);
    };

    const logOut = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signed: !!user, loadingAuth, handleInfoUser, user, logOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
