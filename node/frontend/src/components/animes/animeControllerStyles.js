import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerEditable: {
    flexDirection: 'column',
  },
}));
