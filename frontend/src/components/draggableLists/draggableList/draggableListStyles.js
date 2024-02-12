import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  listRoot: ({count}) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '400px',
    minWidth: '200px',
    width: `calc(calc(100% - ${(count - 1) * 8}px) / ${count})`,
  }),
  list: {
    '&.MuiStack-root': {
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(),
      flexGrow: 1,
    },
  },
  listDraggingOver: {
    '&.MuiStack-root': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  element: {
    userSelect: 'none',
    padding: theme.spacing(),
    minHeight: '24px',
  },
  addButton: {
    '&.MuiButton-root': {
      borderRadius: 0,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.main,
      position: 'sticky',
      bottom: '-1px',
      '&.Mui-disabled': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
  removeButton: {
    '&.MuiIconButton-root': {
      width: '100%',
      borderRadius: 0,
      padding: 0,
    },
  },
  listTitle: {
    padding: theme.spacing(),
    textAlign: 'center',
    borderBottom: `3px solid ${theme.palette.background.paper}`,
    backgroundColor: theme.palette.background.paper,
    position: 'sticky',
    top: 0,
    zIndex: 2,
    userSelect: 'none',
  },
  listTitleError: {
    borderColor: theme.palette.error.dark,
  },
}));
