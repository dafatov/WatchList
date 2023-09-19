import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  url: {
    '&.MuiTextField-root': {
      marginTop: theme.spacing(),
    }
  },
  editableContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    '&.MuiButton-root': {
      minWidth: 0,
      textAlign: 'justify',
    },
  },
  copyButton: {
    '&.MuiIconButton-root': {
      alignSelf: 'center',
    },
  },
  badge: {
    '&.MuiBadge-root': {
      flexShrink: 1,
    },
  },
}));
