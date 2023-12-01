import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  rootHovered: {
    backgroundColor: theme.palette.secondary.light,
  },
  actions: {
    display: 'none',
  },
  actionsHovered: {
    backgroundColor: theme.palette.secondary.main,
    position: 'absolute',
    display: 'flex',
    zIndex: 100,
  },
}));
