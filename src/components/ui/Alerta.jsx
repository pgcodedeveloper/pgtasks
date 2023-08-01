import React, {forwardRef, useState} from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Alerta = ({tipo, texto, open,handleClose}) => {
    

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={tipo} sx={{ width: '100%' }}>
                    {texto}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default Alerta
