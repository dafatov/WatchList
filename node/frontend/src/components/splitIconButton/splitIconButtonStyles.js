import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '52px',
  },
  topButton: {
    '&.MuiIconButton-root': {
      paddingTop: 0,
      paddingBottom: 0,
      border: '1px solid',
      borderLeft: 0,
      borderRadius: 0,
      borderTopRightRadius: '12px',
    }
  },
  bottomButton: {
    '&.MuiIconButton-root': {
      paddingTop: 1,
      paddingBottom: 0,
      border: '1px solid',
      borderLeft: 0,
      borderTop: 0,
      borderRadius: 0,
      borderBottomRightRadius: '12px',
    }
  },
  mainButton: {
    '&.MuiIconButton-root': {
      border: '1px solid',
      borderLeft: 0,
      borderRadius: '0 12px 12px 0',
      minHeight: '52px',
    }
  },
}));
