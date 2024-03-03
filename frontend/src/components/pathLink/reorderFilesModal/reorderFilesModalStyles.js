import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
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
  editPostfixRoot: {
    padding: theme.spacing(2),
  },
  editPostfixButton: {
    '&.MuiIconButton-root': {
      position: 'absolute',
      left: 0,
      padding: 0,
    },
  },
}));
