import React, {useState, useEffect,  useContext} from 'react'
import Layout from './components/layout/Layout'
import Vistas from './components/ui/Vistas'
import { Box } from '@mui/material';
import './styles/Tareas.css'
import ViewLista from './components/ViewLista';
import ViewTabla from './components/ViewTabla';
import Alerta from './components/ui/Alerta';
import { FirebaseContext } from './firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import Pagina from './components/Pagination';
import Loader from './components/ui/Loader';

const Tareas = () => {
    const [view, setView] = useState('list');
    const [cargando,setCargando] = useState(true);
    const [open, setOpen] = useState(false);
    const [cambios, setCambios] = useState(false);
    const [alerta, setAlerta] = useState({});
    const [tareas, setTareas] = useState([]);
    const [hayDatos, setHayDatos] = useState(true);
    const [tareasFiltro, setTareasFiltro] = useState([]);
    const [paginaAct, setPaginaAct] = useState(1);
    const [cantPage, setCantPage] = useState(0);
    const [cantPorPage, setCantPorPage] = useState(5);
    const { firebase } = useContext(FirebaseContext);
    const [login, setLogin] = useState(window != undefined ? JSON.parse(window.localStorage.getItem('auth')) : {});

    const handleChange = (event, nextView) => {
        setView(nextView);
    };

    const handleChangePage = (event, value) =>{
        setPaginaAct(value);
    }

    const handleAlerta = (alert) => {
        
        setCambios(true);
        
        setAlerta(alert);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setCambios(false);
        setAlerta({});
        setOpen(false);
    };

    const handleChangePorPage = (e) =>{
        if(+e.target.value > 0 && +e.target.value <= 20){
            setCantPorPage(+e.target.value);
        }
        else{
            handleAlerta({
                tipo: "warning",
                texto: 'Número no permitido, debe ser menor o igual a 20'
            });
        }
    }

    const handleActualizarTareas = (t) =>{
        setTareas(tareas.find(ta => ta.id === t.id ? t : ta));
    }

    const handleEliminarTareas = async (id) => {
        try {
            const tareasRef = doc(firebase.db,"tareas",id);
            //Act la BD
            await deleteDoc(tareasRef);

            //Act el state
            setTareas(tareas.filter(t => t.id !== id));
            setTareasFiltro(tareasFiltro.filter(t => t.id !== id));

            handleAlerta({
                tipo:'success',
                texto: 'Tarea eliminada correctamente'
            });
        } catch (error) {
            console.log(error);
            handleAlerta({
                tipo:' error',
                texto: 'Hubo un error'
            });
        }
        
    }
    
    useEffect(() =>{
        if(login?.uid){
            const obtenerTareas = async () =>{
                setCargando(true);
                const tareasRef = collection(firebase.db, 'tareas');
                const queryT = query(tareasRef, where('usuarioId','==',login?.uid));
                const q = await getDocs(queryT);

                const tareasF = q.docs.map( doc =>{
                    return{
                        id: doc.id,
                        ...doc.data()
                    }
                });
                setTareas(tareasF);
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
    },[(cambios === true)]);

    useEffect(() =>{
        if(tareas.length > 0){
            const cant = Math.ceil(tareas.length / cantPorPage);
            setCantPage(cant);
        }
        else if(tareas.length === 0 && !hayDatos){
            setCargando(false);
        }
        else{
            setCargando(true);
        }
    },[tareas,cantPorPage]);

    useEffect(() =>{
        if(tareas.length > 0){
            const indiceIni = (paginaAct - 1) * cantPorPage;
            const indiceFin = indiceIni + cantPorPage;
            setTareasFiltro(tareas.slice(indiceIni,indiceFin));
        }
        else if(tareas.length === 0 && !hayDatos){
            setCargando(false);
        }
        else{
            setCargando(true);
        }
    },[tareas,paginaAct,cantPorPage]);
    
    useEffect(() =>{
        if(!login){
            navigate('/login');
        }
    },[]);
    
    return (
        <>
            {cargando ? <Loader /> :(
                <Layout titulo={"Administra tus tareas"}>
                    <main className='contenedor'>
                        <h2 className='heading'>Tareas</h2>

                        <div className='vistas'>
                            <Vistas 
                                view={view}
                                handleChange={handleChange}
                            />
                        </div>

                        <Box className="box-vistas">
                            {view === 'list' ? (
                                <ViewLista 
                                    tareas={tareasFiltro}
                                    texto={'Aún no hay tareas'}
                                    handleAlerta={handleAlerta}
                                    handleActualizarTareas={handleActualizarTareas}
                                    handleEliminarTareas={handleEliminarTareas}
                                />
                            ) : view === 'module' ? (
                                <ViewTabla 
                                    tareas={tareasFiltro}
                                    handleAlerta={handleAlerta}
                                    handleActualizarTareas={handleActualizarTareas}
                                    handleEliminarTareas={handleEliminarTareas}
                                />
                            ) : (
                                <ViewLista
                                    tareas={tareasFiltro}
                                    texto={'Aún no hay tareas'}
                                    handleAlerta={handleAlerta}
                                    handleActualizarTareas={handleActualizarTareas}
                                    handleEliminarTareas={handleEliminarTareas}
                                />
                            )}
                        </Box>

                        
                        <Box className="box-paginacion" sx={{mt: '2rem'}}>
                            <div className='box-paginacion--texto'>
                                <p >Max por página: </p>
                                <input type="number" min={1} max={20} name='cantPorPage' id='cantPorPage' value={cantPorPage} onChange={handleChangePorPage}/>
                            </div>
                            <Pagina 
                                paginaAct={paginaAct}
                                handleChange={handleChangePage}
                                cantPage={cantPage}
                            />
                        </Box>  
                        
                    </main>

                    <Alerta 
                        open={open}
                        texto={alerta.texto}
                        tipo={alerta.tipo}
                        handleClose={handleClose}
                    />
                </Layout>
            )}
        </>
    )
}

export default Tareas
