import React from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Pagina = ({paginaAct, handleChange, cantPage}) => {
    return (
        <Stack spacing={2}>
            <Pagination count={cantPage} page={paginaAct} onChange={handleChange} color="primary" />
        </Stack>
    )
}

export default Pagina
