import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import ModalTarea from './Modal';
import Options from '../Options';
import Swal from 'sweetalert2';

const Tarea = ({tarea,handleAlerta,handleEliminarTareas,handleActualizarTareas} ) => {

    const [open, setOpen] = useState(false);
    const [tareaState, setTareaState] = useState(tarea);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [anchorEl, setAnchorEl] = useState(null);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseOp = () => {
        setAnchorEl(null);
    };


    const handleActualizarTarea = (t) =>{
        handleActualizarTareas(t);
        setTareaState(t);
    }

    const handleConfElimT = (e) =>{
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
                await handleEliminarTarea(e);
            }
        });
    }
    const handleEliminarTarea = async() =>{
        await handleEliminarTareas(tareaState?.id);
    }
    return (
        <>
            <Card className='card'>
                <CardActionArea 
                    onClick={handleClick}
                >
                    <CardMedia
                        height="140"
                        className={`icono_tarea ${tareaState?.icono?.icono_color}`}
                    >
                        <i className={tareaState?.icono?.icono_class}></i>
                    </CardMedia>
                    
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {tareaState?.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {tareaState?.descripcion?.substring(0,16)} ...
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <Options
                    anchorEl={anchorEl}
                    handleCloseOp={handleCloseOp}
                    handleOpen={handleOpen}
                    handleEliminarTarea={handleConfElimT}
                />
            </Card>

            <ModalTarea 
                open={open}
                handleClose={handleClose}
                tarea={tareaState}
                handleActualizarTarea={handleActualizarTarea}
                handleAlerta={handleAlerta}
            />
        </>
    )
}

export default Tarea
