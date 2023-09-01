import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  dialRoot: {
    backgroundColor: theme.palette.secondary.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dialActions: {
    display: 'none'
  },
  dialActionsHovered: {
    backgroundColor: theme.palette.secondary.main,
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
}));
