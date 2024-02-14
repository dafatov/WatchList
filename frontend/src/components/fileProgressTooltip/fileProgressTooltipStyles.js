import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  action: {
    padding: theme.spacing(),
    textAlign: 'center',
    userSelect: 'none',
  },
  divider: {
    '&.MuiDivider-root': {
      marginBottom: theme.spacing(),
    },
  },
}));
