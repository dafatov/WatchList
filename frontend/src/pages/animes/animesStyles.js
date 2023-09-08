import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  nameHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameHeaderTitle: {
    paddingRight: theme.spacing(),
  },
}));
