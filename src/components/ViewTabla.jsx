import React, {useEffect, useState} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ModalTarea from './ui/Modal';
import './../styles/Tarea.css'
import Swal from 'sweetalert2';

const ViewTabla = ({tareas,handleAlerta,handleActualizarTareas,handleEliminarTareas}) => {
    const [open, setOpen] = useState(false);
    const [tareaState, setTareaState] = useState({});
    const [hayTarea, setHayTarea] = useState(false);
    
    const handleOpen = (e) => {
        const id = e.target.dataset.id;
        setTareaState(tareas.find(t => t.id === id));
    };
    const handleClose = () => {
        setTareaState({});
        setHayTarea(false);
        setOpen(false);
    };

    const handleActualizarTarea = (t) =>{
        handleActualizarTareas(t);
    }

    const handleConfiElimT = async(e) =>{
        Swal.fire({
            title: '¿Desea eliminar esta tarea?',
            text: 'Esta acción no se podra recuperar',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No'
        }).then(async (response) =>{
            if(response.isConfirmed){
                await handleElimTarea(e);
            }
        });
    }

    const handleElimTarea = async(e) =>{
        const id = e.target.dataset.id;
        await handleEliminarTareas(id);
    }

    useEffect(() =>{
        if(tareaState?.id){
            setHayTarea(true);
            setOpen(true);
        }
    },[tareaState]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" className='tabla'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">Prioridad</TableCell>
                            <TableCell align="right">Fecha Inicio</TableCell>
                            <TableCell align="right">Fecha Entrega</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tareas?.map((row) => (
                            <TableRow
                                key={row?.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell scope="row" className='rows'>
                                    <div>
                                        <span className={row?.icono.icono_color}><i className={row?.icono.icono_class}></i></span>
                                        {row?.nombre}
                                    </div>
                                </TableCell>
                                <TableCell align="right" className='rows'>
                                    <span className={row?.estado}>{row?.estado}</span>
                                </TableCell>
                                <TableCell align="right" className='rows'>
                                    <span className={row?.prioridad}>{row?.prioridad}</span>
                                </TableCell>
                                <TableCell align="right" className='rows'>
                                    {row?.fechaInicio}
                                </TableCell>
                                <TableCell align="right" className='rows'>
                                    {row?.fechaEntrega}
                                </TableCell>
                                <TableCell align="center" className='rows row-accion'>
                                    <div className='row-accion'>
                                        <i 
                                            className="fa-regular fa-pen-to-square"
                                            onClick={handleOpen}
                                            data-id={row?.id}
                                        ></i>
                                        <i 
                                            className="fa-solid fa-trash-can"
                                            data-id={row?.id} 
                                            onClick={handleConfiElimT}   
                                        ></i>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {hayTarea && (
                <ModalTarea 
                    open={open}
                    handleClose={handleClose}
                    tarea={tareaState}
                    handleActualizarTarea={handleActualizarTarea}
                    handleAlerta={handleAlerta}
                />
            )}
        </>
    )
}

export default ViewTabla
