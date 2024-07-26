import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ErrorDialog = ({ open, handleClose, errorMessage }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Error</DialogTitle>
    <DialogContent>
      <DialogContentText>{errorMessage}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default ErrorDialog;