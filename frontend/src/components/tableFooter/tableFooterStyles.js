import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
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
}));
