import React from 'react'

const LayoutLogin = ({children, titulo}) => {
    return (
        <>
            <title>PGTasks - {titulo}</title>

            <main className='contenedor login'>
                <div className='contenedor-heading'>
                    <h1>PG<span>Tasks</span></h1>
                    <p>Administra tus proyectos de forma rápida y sencilla</p>
                </div>
                {children}
            </main>
            
        </>
    )
}

export default LayoutLogin
