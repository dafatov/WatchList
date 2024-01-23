import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  autocomplete: {
    '&.MuiAutocomplete-popper': {
      minWidth: 'min-content',
    },
  },
  menuItemIcon: {
    marginRight: theme.spacing(2),
  },
}));
