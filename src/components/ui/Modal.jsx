import React, {  useEffect, useState,useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import './../../styles/ModalTarea.css'
import { Box } from '@mui/material';
import MenuItems from '../Menu';
import { doc, updateDoc } from 'firebase/firestore';
import {FirebaseContext} from '../../firebase';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[700],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const ModalTarea = ({open, handleClose, tarea, handleActualizarTarea,handleAlerta}) => {
    const { id ,nombre, descripcion, estado, prioridad, icono, fechaInicio, fechaEntrega} = tarea;
    const {icono_class, icono_color} = icono;
    const [editar, setEditar] = useState(false);
    const [editarE, setEditarE] = useState(false);
    const [editarF, setEditarF] = useState(false);
    const [guardar, setGuardar] = useState(false);
    const [tareaEdit, setTareaEdit] = useState(tarea);

    useEffect(() =>{
        if(id !== tareaEdit.id){
            setTareaEdit(tarea);
        }
    },[open]);

    const {firebase} = useContext(FirebaseContext);

    const opPrioridad = {
        name: "prioridad",
        tipo: ["alta","media","baja"]
    };
    const opEstado = {
        name: "estado",
        tipo: ["listo","en progreso","no iniciado"]
    };
    
    useEffect(() =>{
        if(hayCambios()){
            setGuardar(true);
        }
        else{
            setGuardar(false);
        }
    },[tareaEdit])

    const handleChange = (e) =>{
        
        setTareaEdit({...tareaEdit,
            [e.target.name] : e.target.value
        });
    }

    const handleClick = op =>{
        setTareaEdit({...tareaEdit,
            [op.name] : op.value
        });
    }

    const hayCambios = () =>{
        if(descripcion === tareaEdit.descripcion && prioridad === tareaEdit.prioridad && estado === tareaEdit.estado && fechaInicio === tareaEdit.fechaInicio && fechaEntrega === tareaEdit.fechaEntrega){
            return false;
        }
        else{
            return true;
        }
    }

    const rangoDias = (f1,f2) =>{
        if(f1 != undefined && f2 != undefined){
            const fecha1 = f1.split('-');
            const fecha2 = f2.split('-');
            const fI = new Date(fecha1[0],fecha1[1]-1,fecha1[2]);
            const fE = new Date(fecha2[0],fecha2[1]-1,fecha2[2]);
            const difMilis = fE - Date.now();
            let dias = Math.round(difMilis / 86400000);
            if(dias < 0){
                dias = 0;
            }
            return dias;
        }
    }

    const handleSubmit = () =>{
        try {
            const docRef = doc(firebase.db, "tareas", `${id}`);

            //Guardar los cambios
            updateDoc(docRef, {
                descripcion: tareaEdit.descripcion,
                prioridad: tareaEdit.prioridad,
                estado: tareaEdit.estado,
                fechaInicio: tareaEdit.fechaInicio,
                fechaEntrega: tareaEdit.fechaEntrega
            });

            //Act state
            handleActualizarTarea(tareaEdit);
            
            //Resetear los states
            setEditar(false);
            setEditarE(false);
            setEditarF(false);
            setGuardar(false);
            handleClose();

            //Mostar alerta
            handleAlerta({
                tipo: 'success',
                texto: 'Tarea actualizada correctamente'
            });
        } catch (error) {
            console.log(error);
            handleClose();
            handleAlerta({
                tipo: 'error',
                texto: 'Hubo un error al intentar actualizar'
            });
        }
        

    }

    return (
        <BootstrapDialog
            onClose={() =>{
                if(!editar && !editarE && !editarF && descripcion === tareaEdit.descripcion && prioridad === tareaEdit.prioridad && estado === tareaEdit.estado && fechaInicio === tareaEdit.fechaInicio && fechaEntrega === tareaEdit.fechaEntrega){
                    handleClose();
                }
                else{
                    alert("NO")
                }
            }}
            aria-labelledby="customized-dialog-title"
            open={open}
            className='modalDialog'
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={() =>{
                if(!editar && !editarE && !editarF && descripcion === tareaEdit.descripcion && prioridad === tareaEdit.prioridad && estado === tareaEdit.estado && fechaInicio === tareaEdit.fechaInicio && fechaEntrega === tareaEdit.fechaEntrega){
                    
                    handleClose();
                }
                else{

                }
            }}>
                <i className={icono_class} data-color={icono_color}></i>
                {nombre}
            </BootstrapDialogTitle>
            <DialogContent dividers className='contenido-modal'>
                <Box className='box-descripcion'>
                    <div className='box-title'>
                        <Typography gutterBottom variant='h3'>
                            Descripción
                        </Typography>
                        <i 
                            className={`fa-solid ${editar ? 'fa-xmark' : 'fa-pen-to-square'}`}
                            onClick={() => setEditar(!editar)}
                        ></i>
                    </div>
                    <div className='box-body'>
                        <textarea onChange={(e) => handleChange(e)} name="descripcion" id="descripcion" readOnly={!editar} className={`box-textarea ${editar ? 'textarea-edit' : 'textarea-no-edit'}`} value={descripcion ? tareaEdit.descripcion : ''}></textarea>
                    </div>
                </Box>

                <Box className='box-infoextra'>
                    <div className='box-title'>
                        <Typography gutterBottom variant='h3'>
                            Información Extra
                        </Typography>
                        <i 
                            className={`fa-solid ${editarE ? 'fa-xmark' : 'fa-pen-to-square'}`}
                            onClick={() => setEditarE(!editarE)}
                        ></i>
                    </div>
                    <div className='box-body'>
                        <ul className='box-lista'>
                            <li className='box-elemento'>
                                <p className='box-elemento-text'>Prioridad: 
                                    <span className={tareaEdit.prioridad}>{tareaEdit.prioridad}</span>
                                </p>
                                <MenuItems 
                                    activo={editarE}
                                    opciones={opPrioridad}
                                    handleClicks={handleClick}
                                />
                            </li>
                            <li className='box-elemento'>
                                <p className='box-elemento-text'>Estado: 
                                    <span className={tareaEdit.estado}>{tareaEdit.estado}</span>
                                </p>
                                <MenuItems 
                                    activo={editarE}
                                    opciones={opEstado}
                                    handleClicks={handleClick}
                                />
                            </li>
                        </ul>
                    </div>
                </Box>

                <Box className='box-infoextra'>
                    <div className='box-title'>
                        <Typography gutterBottom variant='h3'>
                            Plazos
                        </Typography>
                        <i 
                            className={`fa-solid ${editarF ? 'fa-xmark' : 'fa-pen-to-square'}`}
                            onClick={() => setEditarF(!editarF)}
                        ></i>
                    </div>
                    <div className='box-body'>
                        <ul className='box-lista'>
                            <li className='box-elemento'>
                                <p className='box-elemento-text fecha'>Fecha de Inicio: </p>
                                <input type="date" name="fechaInicio" readOnly={!editarF} id="fechaInicio" value={tareaEdit?.fechaInicio} onChange={e => handleChange(e)}/>
                            </li>
                            
                            <li className='box-elemento'>
                                <p className='box-elemento-text fecha'>Fecha de Entrega: </p>
                                <input type="date" name='fechaEntrega' readOnly={!editarF} id='fechaEntrega' value={tareaEdit?.fechaEntrega} onChange={e => handleChange(e)}/>
                            </li>
                            
                            <li className='box-elemento'>
                                <p className='box-elemento-text'>Dias para la entrega: 
                                    <span className={`span_fecha ${rangoDias(tareaEdit?.fechaInicio,tareaEdit?.fechaEntrega) > 2 ? 'rango_verde' : 'rango_rojo'}`}>
                                        {rangoDias(tareaEdit?.fechaInicio,tareaEdit?.fechaEntrega)}
                                        <i className="fa-regular fa-calendar-days"></i>
                                    </span>
                                </p>

                            </li>
                        </ul>
                    </div>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleSubmit} disabled={!guardar}>
                    Guardar Cambios
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default ModalTarea

