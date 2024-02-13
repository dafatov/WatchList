import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    '&.MuiStack-root': {
      overflowY: 'auto',
      flexWrap: 'wrap',
      '&::-webkit-scrollbar': {
        width: theme.spacing(),
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.background.paper,
        borderTopRightRadius: theme.spacing(),
        borderBottomRightRadius: theme.spacing(),
      },
    },
  },
}));
