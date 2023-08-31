import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  url: {
    marginTop: theme.spacing(),
  },
  editableContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    textAlign: 'justify',
  },
}));
