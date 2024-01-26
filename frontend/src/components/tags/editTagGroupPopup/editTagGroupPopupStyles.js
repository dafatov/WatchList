import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  autocomplete: {
    '&.MuiAutocomplete-root': {
      margin: theme.spacing(2),
    }
  },
  menuItemIcon: {
    marginRight: theme.spacing(2),
  },
  inputAdornment: {
    '&.MuiInputAdornment-root': {
      marginRight: 0,
    },
  },
}));
