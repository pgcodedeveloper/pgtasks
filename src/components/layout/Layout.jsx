import React, { useContext, useEffect } from 'react'
import Header from '../ui/Header'
import { FirebaseContext } from '../../firebase'
import { navigate } from 'wouter/use-location';

const Layout = ({children,titulo}) => {

    
    return (
        <>
            <title>PGTasks - {titulo}</title>

            <Header />
            {children}
        </>
    )
}

export default Layout
