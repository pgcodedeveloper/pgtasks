import React, { useState } from 'react'
import LayoutLogin from './components/layout/LayoutLogin'
import './styles/Login.css'
import { Button } from '@mui/material'
import { Link  }  from 'wouter'
import Swal from 'sweetalert2'
import firebase from './firebase'
import { navigate } from 'wouter/use-location'

const Registro = () => {
    const [usuario, setUsuario] = useState({});
    
    const handleChange =(e) =>{
        setUsuario({...usuario,
            [e.target.name] : e.target.value
        });
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(Object.values(usuario).includes('')){
            Swal.fire({
                title: 'Error',
                text: 'Debe ingresar valores en todos los campos',
                icon:'error'
            });
        }
        else{
            if(usuario.password === usuario.passwordR){
                try {
                    await firebase.registrar(usuario.nombre,usuario.email,usuario.password);
                    Swal.fire({
                        title: 'Exito',
                        text: 'El usuario se creo correctamente',
                        icon: 'success',
                        timer: 2500
                    });
                    navigate('/login');
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: 'Error',
                        text: error.message,
                        icon: 'error',
                        timer: 2500
                    });
                }
            }
            else{
                Swal.fire({
                    title: 'Error',
                    text: 'Los passwords son diferentes',
                    icon:'error'
                });
            }
        }

        
    }
    return (
        <LayoutLogin
            titulo={"Crea una cuenta"}
        >  
            <form className='formulario' onSubmit={e => handleSubmit(e)}>
                <div className='campos'>

                    <div className='campo-2'>
                        <label className='label' htmlFor="nombre">Nombre</label>
                        
                        <div className='campo-input'>
                            <i className="fa-solid fa-user"></i>
                            <input className='input' type="text" name='nombre' id='nombre' value={usuario?.nombre} onChange={(e) => handleChange(e)} placeholder='Ingrese su nombre'/>
                        </div>
                    </div>

                    <div className='campo-2'>
                        <label className='label' htmlFor="email">Correo</label>
                        
                        <div className='campo-input'>
                            <i className="fa-solid fa-envelope"></i>
                            <input className='input' type="email" name='email' id='email' value={usuario?.email} onChange={(e) => handleChange(e)} placeholder='Ingrese su email'/>
                        </div>
                    </div>

                    <div className='campo-2'>
                        <label className='label' htmlFor="password">Password</label>
                        
                        <div className='campo-input'>
                            <i className="fa-solid fa-key"></i>
                            <input className='input' type="password" name='password' id='password' value={usuario?.password} onChange={(e) => handleChange(e)} placeholder='Ingrese su password'/>
                        </div>
                    </div>

                    <div className='campo-2'>
                        <label className='label' htmlFor="passwordR">Repetir Password</label>
                        
                        <div className='campo-input'>
                            <i className="fa-solid fa-key"></i>
                            <input className='input' type="password" name='passwordR' id='passwordR' value={usuario?.passwordR} onChange={(e) => handleChange(e)} placeholder='Ingrese su password'/>
                        </div>
                    </div>
                </div>

                <div className='contenedor-botones'>
                    <Button variant='contained' color='success' type='submit'>
                        Crear Cuenta
                    </Button>
                    <Button variant='contained'>
                        Continuar con
                        <i className="fa-brands fa-google"></i>
                    </Button>
                </div>
            </form>

            <div className='acciones'>
                <Link href="/login">¿Ya tienes una cuenta? Inicia Sesión</Link>
            </div>
        </LayoutLogin>
    )
}

export default Registro
