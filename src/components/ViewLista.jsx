import React from 'react'
import './../styles/Tarea.css'
import Tarea from './ui/Tarea'

const ViewLista = ({tareas,texto,handleAlerta,handleEliminarTareas,handleActualizarTareas}) => {
    return (
        <div className='listado_tareas'>
            {tareas?.length > 0 ? (
                <>
                    {tareas?.map(t =>(
                        <Tarea 
                            key={t.id}
                            tarea={t}
                            handleAlerta={handleAlerta}
                            handleActualizarTareas={handleActualizarTareas}
                            handleEliminarTareas={handleEliminarTareas}
                        />
                    ))}
                </>
            ): (
                <p>{texto ? texto : ''}</p>
            )}
        </div>
    )
}

export default ViewLista
