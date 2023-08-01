import React, { useState } from 'react'
import LayoutLogin from './components/layout/LayoutLogin'
import './styles/Login.css'
import { Button } from '@mui/material'
import { Link } from 'wouter'
import firebase from './firebase'
import Swal from 'sweetalert2'
import { navigate } from 'wouter/use-location'

const Login = () => {
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
            try {
                await firebase.login(usuario.email,usuario.password);
                //navigate('/');
                window.location.href = `${window.location.origin}/`;
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
    }

    const handleLoginGoogle = async() =>{
        try {
            await firebase.loginGoogle();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <LayoutLogin
            titulo={"Iniciar Sesión"}
        >  
            <form className='formulario' onSubmit={e => handleSubmit(e)}>
                <div className='campos'>
                    <div className='campo-2'>
                        <label className='label' htmlFor="email">Correo</label>
                        
                        <div className='campo-input'>
                            <i className="fa-solid fa-envelope"></i>
                            <input className='input' type="email" name='email' id='email' value={usuario?.email ? usuario?.email : ''} onChange={(e) => handleChange(e)} placeholder='Ingrese su email'/>
                        </div>
                    </div>

                    <div className='campo-2'>
                        <label className='label' htmlFor="password">Password</label>
                        
                        <div className='campo-input'>
                            <i className="fa-solid fa-key"></i>
                            <input className='input' type="password" name='password' id='password' value={usuario?.password ? usuario?.password : ''} onChange={(e) => handleChange(e)} placeholder='Ingrese su password'/>
                        </div>
                    </div>
                </div>

                <div className='contenedor-botones'>
                    <Button variant='contained' color='success' type='submit'>
                        Iniciar Sesión
                    </Button>
                    <Button variant='contained' onClick={handleLoginGoogle}>
                        Continuar con
                        <i className="fa-brands fa-google"></i>
                    </Button>
                </div>
            </form>

            <div className='acciones'>
                <Link href="/registro">¿Aún no tienes una cuenta? Crea una</Link>
            </div>
        </LayoutLogin>
    )
}

export default Login
