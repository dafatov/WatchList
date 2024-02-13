import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  dialogPaper: {
    '&.MuiPaper-root': {
      maxWidth: 'calc(100% - 64px)',
      overflow: 'hidden',
    },
  },
  dialogContent: {
    '&.MuiDialogContent-root': {
      display: 'flex',
      overflow: 'hidden',
    },
  },
  data: {
    textWrap: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '&:hover, &.isDragging': {
      overflow: 'auto',
      textWrap: 'wrap',
      textOverflow: 'ellipsis',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
    },
  },
}));
