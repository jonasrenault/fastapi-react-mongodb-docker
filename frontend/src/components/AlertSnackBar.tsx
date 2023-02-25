import { useContext, Fragment } from 'react';
import { SnackBarContext } from '../contexts/snackbar';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function AlertSnackBar() {
  const { snackBar, isOpen, closeSnackBar } = useContext(SnackBarContext);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    closeSnackBar();
  };

  const action = (
    <Fragment>
      <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
        <CloseIcon fontSize='small' />
      </IconButton>
    </Fragment>
  );

  return (
    <div>
      <Snackbar
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        // message='Note archived'
        action={action}
      >
        {snackBar?.content}
      </Snackbar>
    </div>
  );
}
