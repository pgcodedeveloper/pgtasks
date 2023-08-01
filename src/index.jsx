import React, { useEffect, useState,useContext } from 'react'
import Layout from './components/layout/Layout'
import Tarea from './components/ui/Tarea';
import Alerta from './components/ui/Alerta';
import { FirebaseContext } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './styles/Tarea.css'
import Loader from './components/ui/Loader';
import { navigate } from 'wouter/use-location';

const Inicio = () => {

    const [cargando,setCargando] = useState(true);
    const [open, setOpen] = useState(false);
    const [cambios, setCambios] = useState(false);
    const [alerta, setAlerta] = useState({});
    const [tareas, setTareas] = useState([]);
    const [hayDatos,setHayDatos] = useState(true);
    const {firebase} = useContext(FirebaseContext);
    const [tareaFiltro, setTareaFiltro] = useState([]);
    const [login, setLogin] = useState(window != undefined ? JSON.parse(window.localStorage.getItem('auth')) : {});
    const [tareasFiltro2, setTareaFiltro2] = useState([]);
    const [tareasFiltro3, setTareaFiltro3] = useState([]);
    
    const handleAlerta = (alert) => {
        setCambios(true);
        setAlerta(alert);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        console.log(reason);
        if (reason === 'clickaway') {
            return;
        }
        setCambios(false);
        setAlerta({});
        setOpen(false);
    };

    useEffect(() =>{
        if(login?.uid){
            const obtenerTareas = async () =>{
                setCargando(true);
                const tareasRef = collection(firebase.db, 'tareas');
                const queryT = query(tareasRef, where('usuarioId','==',login?.uid));
                const q = await getDocs(queryT);

                const tareas = q.docs.map( doc =>{
                    return{
                        id: doc.id,
                        ...doc.data()
                    }
                });
                setTareas(tareas);
                if(tareas.length > 0){
                    setHayDatos(true);
                }
                else{
                    setHayDatos(false);
                    setCargando(false);
                }
                setCargando(false);
            }
            obtenerTareas();
        }
    },[cambios]);

    useEffect(() =>{
        if(tareas.length > 0 && hayDatos){
            setCargando(false);
            setTareaFiltro(tareas.filter(t => {
                if(t.fechaEntrega != undefined){
                    const fecha = t.fechaEntrega?.split('-');
                    const fechaE = new Date(fecha[0],fecha[1]-1,fecha[2]);
                    const fechaHoy = new Date(Date.now());
                    if(fechaE.getDate() === fechaHoy.getDate() && fechaE.getMonth() === fechaHoy.getMonth()){
                        return t;
                    }
                }
            }));

            setTareaFiltro2(tareas.filter(t =>{
                if(t.prioridad === 'alta'){
                    return t;
                }
            }));

            setTareaFiltro3(tareas.filter(t => {
                if(t.estado === 'no iniciado'){
                    return t;
                }
            }));
        }
        else if(tareas.length === 0 && !hayDatos){
            setCargando(false);
        }
        else{
            setCargando(true);
        }
    },[tareas]);

    useEffect(() =>{
        if(!login){
            navigate('/login');
        }
    },[]);

    return (
        <>
            {cargando ? <Loader /> : (
                <Layout titulo={"Administrar, crear y completar tareas"}>
                    <main className='contenedor'>
                        <h2 className='heading'>Administra tus tareas</h2>
                        
                        <div>
                            <h3>Tareas para Hoy</h3>
                            <div className='listado_tareas'>
                                {tareaFiltro?.length > 0 && hayDatos ? (
                                    <>
                                        {tareaFiltro?.map(t =>(
                                            <Tarea 
                                                key={t.id}
                                                tarea={t}
                                                handleAlerta={handleAlerta}
                                            />
                                        ))}
                                    </>
                                ): (
                                    <p>Aun no tienes tareas para hoy</p>
                                )}
                            </div>

                            <h3>Tareas Urgentes</h3>
                            <div className='listado_tareas'>
                                {tareasFiltro2?.length > 0 && hayDatos ? (
                                    <>
                                        {tareasFiltro2?.map(t =>(
                                            <Tarea 
                                                key={t.id}
                                                tarea={t}
                                                handleAlerta={handleAlerta}
                                            />
                                        ))}
                                    </>
                                ): (
                                    <p>Aun no tienes tareas</p>
                                )}
                            </div>

                            <h3>Tareas No iniciadas</h3>
                            <div className='listado_tareas'>
                                {tareasFiltro3?.length > 0 && hayDatos ? (
                                    <>
                                        {tareasFiltro3?.map(t =>(
                                            <Tarea 
                                                key={t.id}
                                                tarea={t}
                                                handleAlerta={handleAlerta}
                                            />
                                        ))}
                                    </>
                                ): (
                                    <p>Aun no tienes tareas</p>
                                )}
                            </div>
                        </div>
                    </main>
            
                    <Alerta 
                        tipo={alerta.tipo}
                        texto={alerta.texto}
                        open={open}
                        handleClose={handleClose}
                    />
                </Layout>
            )}
        </>
    )
}

export default Inicio
