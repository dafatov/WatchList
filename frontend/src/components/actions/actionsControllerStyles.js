import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  dialRootHovered: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dialActionsHovered: {
    flexDirection: 'column',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
}));
