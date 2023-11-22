import MuiAutocomplete, {autocompleteClasses} from '@mui/material/Autocomplete';
import {styled} from '@mui/material/styles';

export const Autocomplete = styled(({children, className, ...props}) => (
  <MuiAutocomplete {...props} classes={{popper: className}}>{children}</MuiAutocomplete>
))(() => ({
  [`& .${autocompleteClasses.paper}`]: {
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  },
}));
