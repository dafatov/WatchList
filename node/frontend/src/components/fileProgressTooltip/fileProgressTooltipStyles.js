import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  action: {
    padding: theme.spacing(),
    textAlign: 'center',
  },
  divider: {
    '&.MuiDivider-root': {
      marginBottom: theme.spacing(),
    },
  },
  progress: {
    textAlign: 'center',
    paddingTop: 0,
  },
}));
