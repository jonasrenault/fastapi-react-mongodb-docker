import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { router } from './router';
import { SnackBarProvider } from './contexts/snackbar';
import { AuthProvider } from './contexts/auth';
import './axios';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SnackBarProvider>
          <RouterProvider router={router} />
        </SnackBarProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
