import { Route } from 'wouter';
import Tareas from "./tareas";
import NuevaTarea from "./nueva-tarea";
import Inicio from ".";
import Login from "./login";
import firebase, {FirebaseContext} from './firebase';
import Registro from "./registro";
import useAuth from "./hooks/useAuth";
import { navigate } from 'wouter/use-location';

function App() {

    const { auth , cargandoL } = useAuth();
    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                auth,
                cargandoL
            }}
        >    
            <>
                
                <Route path="/login" component={Login}/>
                <Route path="/registro" component={Registro}/>
                
                <Route path="/" component={Inicio}/>
                <Route path="/tareas" component={Tareas} />
                <Route path="/nueva-tarea" component={NuevaTarea}/>
                       
            </>
        </FirebaseContext.Provider>
    )
}

export default App
