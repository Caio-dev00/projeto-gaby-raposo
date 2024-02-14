import { ReactNode} from "react";
import { Navigate } from "react-router-dom";

interface PrivateProps{
    children: ReactNode
}

export function Private({children} : PrivateProps){
    const signed = false;
    const loadingAuth = true;

    if(loadingAuth){
        return <div></div>
    }

    if(!signed){
        return <Navigate to="/login" />
    }

    return children
}
