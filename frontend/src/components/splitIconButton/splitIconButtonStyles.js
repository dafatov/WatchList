import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '48px',
  },
  leftButton: {
    '&.MuiIconButton-root': {
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 0,
    },
  },
  rightButton: {
    '&.MuiIconButton-root': {
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 0,
    },
  },
  mainButton: {
    '&.MuiIconButton-root': {
      minWidth: '48px',
      borderRadius: 0,
    },
  },
}));
