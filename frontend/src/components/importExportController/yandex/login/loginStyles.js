import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  login: {
    '&.MuiIconButton-root': {
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 0,
      width: '100%',
    },
  }
}));
