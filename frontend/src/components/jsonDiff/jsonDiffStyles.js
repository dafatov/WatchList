import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  formControlLabel: {
    '&.MuiFormControlLabel-root': {
      margin: 0,
    },
  },
  differenceRoot: {
    backgroundColor: '#fff',
    color: '#000',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: theme.spacing(),
      height: theme.spacing(),
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));
