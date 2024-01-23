import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  textField: {
    '&.MuiTextField-root': {
      display: 'flex',
      margin: theme.spacing(2),
    },
  },
}));
