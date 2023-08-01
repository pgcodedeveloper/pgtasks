import React, {createContext, useState, useContext} from 'react'
import { FirebaseContext } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

import { navigate } from 'wouter/use-location';

const TaskContext = createContext();
const TaskProvider = ({children}) => {

    const [tarea, setTarea] = useState({});
    
    
    

    return (
        <TaskContext.Provider
            value={{
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export {
    TaskProvider
}
export default TaskContext
