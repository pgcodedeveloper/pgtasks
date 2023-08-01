import React, { useEffect, useState } from 'react';
import firebase from '../firebase';

const useAuth = () => {

    const [auth,setAuth] = useState(null);
    const [cargandoL, setCargando] = useState(true);
    useEffect(() =>{
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
            
            if(usuario){
                setAuth(usuario);
                window.localStorage.setItem('auth',JSON.stringify(usuario));
            }
            else{
                setAuth(null);
            }
            
            setCargando(false);
        });

        return () => unsuscribe();

    },[]);

    return {auth, cargandoL};
}

export default useAuth
