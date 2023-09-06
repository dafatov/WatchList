import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';
import {styled} from '@mui/material/styles';

export const LoadingProgress = styled(LinearProgress)(({theme}) => ({
  height: 8,
  borderRadius: 12,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.primary.light,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 4,
    backgroundColor: theme.palette.secondary.main,
  },
}));
