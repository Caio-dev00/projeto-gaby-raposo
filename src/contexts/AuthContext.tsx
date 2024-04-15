import { ReactNode, createContext, useState, useEffect } from "react"; 
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../services/firebaseConnection"; 
import { signOut } from 'firebase/auth'

interface AuthProviderProps{
    children: ReactNode;
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: ({ name, email, uid }: UserProps) => void;
    user: UserProps | null;
    logOut: () => void
}

interface UserProps{
    uid: string;
    name: string | null;
    email: string | null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children } : AuthProviderProps){

    const [ user, setUser ] = useState<UserProps | null>(null)
    const [ loadingAuth, setLoadingAuth ] = useState(true)

    useEffect(() => {

        const unsub = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    uid: user.uid,
                    name: user?.displayName,
                    email: user?.email
                })
                setLoadingAuth(false);
            }else{
                setUser(null);
                setLoadingAuth(false);
            }
        })

        return () => {
            unsub();
        }

    },[])

    function handleInfoUser({name, email, uid}: UserProps){
        setUser({
            name,
            email,
            uid
        })
    }

    async function logOut(){
        await signOut(auth);
        setUser(null)
    }

    
    
    return(
        <AuthContext.Provider value={{ signed: !!user, loadingAuth, handleInfoUser, user, logOut }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider