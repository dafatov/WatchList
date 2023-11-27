import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  dialRoot: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    minWidth: '48px',
    right: '1px',
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '0 12px 12px 0',
  },
  'dialRootDisabled': {
    borderColor: theme.palette.action.disabled,
    borderLeft: 'none',
    right: 0,
  },
  dialRootHovered: {
    borderRadius: '0 0 12px 0',
    borderTop: 'none',
  },
  dialActionsHovered: {
    flexDirection: 'column-reverse',
    bottom: '100%',
    border: '1px solid',
    borderBottom: 'none',
    borderColor: theme.palette.primary.main,
    borderRadius: '12px 12px 0 0',
  },
}));
