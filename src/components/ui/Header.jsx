import React, { useContext, useEffect, useState } from 'react'
import '../../styles/Header.css'
import { Link, useLocation } from 'wouter';
import { FirebaseContext } from '../../firebase';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { navigate } from 'wouter/use-location';


const settings = ['Logout'];

const Header = () => {
    const [location] = useLocation();
    const { firebase } = useContext(FirebaseContext);
    const [login, setLogin] = useState(window != undefined ? JSON.parse(window.localStorage.getItem('auth')) : {});
    const [anchorElUser, setAnchorElUser] = useState(null);


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const QcerrarSesion = () =>{
        Swal.fire({
            title: '¿Desea cerrar su sesión?',
            icon:'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Si, cerrar',
            cancelButtonText: 'No'
        }).then((response) =>{
            if(response.isConfirmed){
                handleCerrarSesion();
                
            }
        })
    }
    const handleCerrarSesion = () =>{
        try {
            firebase.cerrarSesion();
            window.localStorage.removeItem('auth');
            navigate('/login');
        } catch (error) {
            console.log(error.message);
        }
    }
    
    return (
        <header>
            <div className='contenedor_logo'>
                <Link href="/" className='logo'>PG<span>Tasks</span></Link>
            </div>

            <div className='navegacion-login'>
                <nav className='navegacion menuVisible' id='menu'>
                    <ul className='menu'>
                        <li>
                            <Link href='/' className={`enlace ${location === "/" ? 'enlace-activo' : ''}`}>
                                <i className="fa-solid fa-house"></i>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href='/tareas' className={`enlace ${location === "/tareas" ? 'enlace-activo' : ''}`}>
                                <i className="fa-solid fa-list-check"></i>
                                Tareas
                            </Link>
                        </li>
                        <li>
                            <Link href='/nueva-tarea' className={`enlace ${location === "/nueva-tarea" ? 'enlace-activo' : ''}`}>
                                <i className="fa-solid fa-folder-plus"></i>
                                Nueva
                            </Link>
                        </li>
                    </ul>
                </nav>

                {login && (
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                {login?.providerData[0]?.photoURL ? (
                                    <Avatar alt={login?.displayName} src={login?.providerData[0]?.photoURL} />
                                ) : (
                                    <Avatar alt={login?.displayName}>{login?.displayName.slice(0,2)}</Avatar>
                                )}
                                
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '46px' }}
                            id="menu-appbar option"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => {
                                    handleCloseUserMenu();
                                    QcerrarSesion();
                                }}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                )}
            </div>
        </header>
    )
}

export default Header
