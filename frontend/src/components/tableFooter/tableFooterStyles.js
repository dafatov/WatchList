import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  tableCell: {
    display: 'grid',
  },
  actionContainer: {
    display: 'flex',
  },
  addButton: {
    '&.MuiIconButton-root': {
      border: '1px solid',
      borderRadius: '12px 0 0 12px',
      flexGrow: 1,
    },
  },
  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  paginationSelect: {
    alignSelf: 'center',
  },
  dialRoot: {
    backgroundColor: theme.palette.secondary.light,
    position: 'relative',
  },
  dialActions: {
    display: 'none'
  },
  dialActionsHovered: {
    backgroundColor: theme.palette.secondary.main,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column-reverse',
    zIndex: 100,
    bottom: '100%',
  },
}));
