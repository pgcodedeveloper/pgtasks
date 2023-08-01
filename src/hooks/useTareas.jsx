import React, {useContext, useEffect, useState} from 'react'
import { FirebaseContext } from './../firebase';
import { collection, getDoc, getDocs } from 'firebase/firestore';


const useTareas = ({condicion}) => {
    
    const [tareas, setTareas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const {firebase } = useContext(FirebaseContext);

    useEffect(() =>{
        const obtenerTareas = async () =>{
            setCargando(true);
            const tareasRef = collection(firebase.db, 'tareas');
            const q = await getDocs(tareasRef);

            const tareas = q.docs.map( doc =>{
                return{
                    id: doc.id,
                    ...doc.data()
                }
            });
            setTareas(tareas);
        }
        obtenerTareas();
        setCargando(false);
    },[condicion]);

    return {
        tareas,
        cargando
    }
}

export default useTareas
