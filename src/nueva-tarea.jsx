import React, { useEffect, useState,useContext } from 'react'
import Layout from './components/layout/Layout'
import { TextField, InputLabel, Select, MenuItem, FormControl, Button,Radio, RadioGroup, FormControlLabel } from '@mui/material'
import '../src/styles/Formulario.css'
import { FirebaseContext } from './firebase';
import { addDoc, collection } from 'firebase/firestore';

import { navigate } from 'wouter/use-location';
import Swal from 'sweetalert2';

const NuevaTarea = () => {

    
    const [ tarea, setTask ] = useState({});
    const [icono, setIcono] = useState({});
    const { firebase } = useContext(FirebaseContext);
    const [login, setLogin] = useState(window != undefined ? JSON.parse(window.localStorage.getItem('auth')) : {});

    const handleSubmit = async e =>{
        e.preventDefault();
        if(!login){
            navigate('/login');
        }
        if(Object.keys(tarea).length === 7){
            tarea.usuarioId = login.uid;
            await addDoc(collection(firebase.db,"tareas"),tarea);
            navigate('/');
        }
        else{
            Swal.fire({
                title: 'Error',
                text:'Debe ingresar datos en todos los campos',
                icon: 'error',
                showCancelButton: true
            });
        }
    }

    const handleChange = e =>{
        setTask({...tarea,
            [e.target.name] : e.target.value
        });
    }
    const handleSelect = e =>{
        setIcono({...icono,
            [e.target.name] : e.target.value
        });
    }
    useEffect(() =>{
        if(icono.icono_class && icono.icono_color){
            setTask({...tarea,
                icono: icono
            });
        }
    },[icono]);

    useEffect(() =>{
        if(!login){
            navigate('/login');
        }
    },[]);
    return (
        <Layout titulo={"Crea nuevas tareas"}>
            <main className='contenedor'>
                <h2 className='heading'>Crea una nueva tarea</h2>

                <form className='formulario' onSubmit={handleSubmit}>
                    <fieldset className='fieldset'>
                        <legend className='legend'>Información sobre la tarea</legend>
                        <div className='campo'>
                            <label htmlFor="standard-basic" className='labels'>Nombre</label>
                            <TextField id="standard-basic" name="nombre" label="Ingrese un nombre para la tarea" variant="standard" onChange={e => handleChange(e)}/>
                        </div>
                        <div className='campo'>
                            <label htmlFor="filled-multiline-flexible" className='labels'>Descripción</label>
                            <TextField
                                id="filled-multiline-flexible"
                                label="Ingrese una descripción"
                                multiline
                                rows={5}
                                variant="standard"
                                name='descripcion'
                                onChange={e => handleChange(e)}
                            />
                        </div>
                        <div className='campo'>
                            <label htmlFor="fechaInicio" className='labels'>Fecha de Inicio</label>
                            <input type="date" id='fechaInicio' name='fechaInicio' onChange={e => handleChange(e)}/>
                        </div>

                        <div className='campo'>
                            <label htmlFor="fechaEntrega" className='labels'>Fecha de Entrega</label>
                            <input type="date" id='fechaEntrega' name='fechaEntrega' onChange={e => handleChange(e)}/>
                        </div>

                    </fieldset>

                    <fieldset className='fieldset'>
                        <legend className='legend'>Información extra</legend>
                        <div className='campo'>
                            <label htmlFor="prioridad" className='labels'>Prioridad</label>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                className='radios'
                                onChange={e => handleChange(e)}
                            >
                                <FormControlLabel value="baja" control={<Radio name='prioridad'/>} label="Baja" className='radio-b'/>
                                <FormControlLabel value="media" control={<Radio name='prioridad'/>} label="Media" className='radio-m'/>
                                <FormControlLabel value="alta" control={<Radio name='prioridad'/>} label="Alta" className='radio-a'/>
                            </RadioGroup>
                        </div>
                        <div className='campo'>
                            <label htmlFor="estado" className='labels'>Estado</label>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                className='radios'
                                onChange={e => handleChange(e)}
                            >
                                <FormControlLabel value="no iniciado" control={<Radio name='estado'/>} label="No Iniciado" className='radio-n'/>
                                <FormControlLabel value="en progreso" control={<Radio name='estado'/>} label="En Progreso" className='radio-p'/>
                                <FormControlLabel value="listo" control={<Radio name='estado'/>} label="Listo" className='radio-l'/>
                            </RadioGroup>
                        </div>

                        <div className='campo'>
                            <label htmlFor="estado" className='labels'>Icono</label>
                            <FormControl>
                                <InputLabel id="demo-controlled-open-select-label">Icono</InputLabel>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    value={icono.icono_class || ''}
                                    label="Icono"
                                    name='icono_class'
                                    className='select'
                                    onChange={e => handleSelect(e)}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem className='item' value={`fa-solid fa-code`}>
                                        Desarrollo
                                        <i className="fa-solid fa-code"></i>
                                    </MenuItem>
                                    <MenuItem className='item' value={`fa-solid fa-circle-info`}>
                                        Investigación
                                        <i className="fa-solid fa-circle-info"></i>
                                    </MenuItem>
                                    <MenuItem className='item' value={`fa-solid fa-pen-ruler`}>
                                        Diseño
                                        <i className="fa-solid fa-pen-ruler"></i>
                                    </MenuItem>
                                    <MenuItem className='item' value={`fa-solid fa-folder`}>
                                        Otro
                                        <i className="fa-solid fa-folder"></i>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className='campo'>
                            <label htmlFor="estado" className='labels'>Color Icono</label>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                className='radios'
                                onChange={e => handleSelect(e)}
                            >
                                <FormControlLabel value="rojo" control={<Radio name='icono_color'/>} label="Rojo" className='radio-r'/>
                                <FormControlLabel value="azul" control={<Radio name='icono_color'/>} label="Azul" className='radio-az'/>
                                <FormControlLabel value="verde" control={<Radio name='icono_color'/>} label="Verde" className='radio-v'/>
                                <FormControlLabel value="amarillo" control={<Radio name='icono_color'/>} label="Amarillo" className='radio-am'/>
                            </RadioGroup>
                        </div>
                    </fieldset>
                    
                    <Button variant="contained" className='btnEnviar' type='submit'>
                        Crear Tarea
                        <i className="fa-solid fa-floppy-disk"></i>
                    </Button>
                </form>
            </main>
        </Layout>
    )
}

export default NuevaTarea
