import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '52px',
  },
  topButton: {
    '&.MuiIconButton-root': {
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: 0,
    }
  },
  bottomButton: {
    '&.MuiIconButton-root': {
      paddingTop: 1,
      paddingBottom: 0,
      borderRadius: 0,
    }
  },
  mainButton: {
    '&.MuiIconButton-root': {
      minHeight: '52px',
      borderRadius: 0,
    }
  },
}));
