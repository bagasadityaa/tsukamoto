import { authLib } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const login = async (email, password) => {
return await signInWithEmailAndPassword(authLib, email, password);
}

export const logout = async ()=>{
    await signOut(authLib);
}