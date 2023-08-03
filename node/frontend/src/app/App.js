import {CircularProgress} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import {SnackbarProvider} from 'notistack';
import {memo, Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {theme} from '../styles/theme';
import {SnackBarProviderProps} from '../utils/snackBar';
import {AppView} from './AppView';

export const App = memo(() => (
  <BrowserRouter basename="/">
    <ThemeProvider theme={theme}>
      <Suspense fallback={<CircularProgress/>}>
        <SnackbarProvider {...SnackBarProviderProps}>
          <AppView/>
        </SnackbarProvider>
      </Suspense>
    </ThemeProvider>
  </BrowserRouter>
));

App.displayName = 'App';
