import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  autocomplete: {
    '&.MuiAutocomplete-popper': {
      minWidth: 'min-content',
    },
  },
}));
