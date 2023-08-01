import { initializeApp } from "firebase/app";
import firebaseConfig from './config';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { getStorage } from '@firebase/storage';

class Firebase {

    constructor(){
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth();
        this.db = getFirestore(app);
        this.storage = getStorage(app);
    }

    //Registrar usuario
    async registrar(nombre, email, password){
        const nuevoUser = await createUserWithEmailAndPassword(this.auth, email, password);

        return await updateProfile(nuevoUser.user,{
            displayName: nombre
        });
    }

    //Iniciar sesion del usuario
    async login(email, password){
        return await signInWithEmailAndPassword(this.auth, email,password);
    }

    //Cerrar la sesion del usuario
    async cerrarSesion(){
        return await this.auth.signOut();
    }

    async loginGoogle(){
        const provider = new GoogleAuthProvider();
        return await signInWithPopup(this.auth,provider);
    }
}


const firebase = new Firebase();
export default firebase;