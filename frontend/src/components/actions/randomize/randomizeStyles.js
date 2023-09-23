import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  dialRoot: {
    backgroundColor: theme.palette.secondary.main,
  },
  dialActions: {
    display: 'none',
  },
  dialActionsHoveredBottom: {
    backgroundColor: theme.palette.secondary.main,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  dialActionsHoveredTop: {
    backgroundColor: theme.palette.secondary.main,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    transform: 'translateY(-40px)',
  },
  previewRandomize: {
    maxWidth: 256,
    width: 'auto',
    height: 'auto',
  },
}));
