import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3bb2d0',
      success: '#50ff50',
      failure: '#ff5050',
    },
    secondary: {
      main: '#1b5f70',
    },
  },
});
