import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  content: {
    maxHeight: '500px',
    minHeight: '100%',
    minWidth: '100%',
  },
  wrapper: {
    position: 'inherit',
    overflow: 'hidden',
  },
  scroller: {
    position: 'inherit',
    overflowY: 'scroll',
    marginRight: '-20px',
    marginLeft: '-16px',
  },
  list: {
    '&.MuiList-root': {
      padding: 0,
    },
  },
}));
