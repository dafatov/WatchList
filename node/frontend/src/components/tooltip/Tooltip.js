import MuiTooltip, {tooltipClasses} from '@mui/material/Tooltip';
import {styled} from '@mui/material/styles';

export const Tooltip = styled(({children, className, ...props}) => (
  <MuiTooltip {...props} classes={{popper: className}}>{children}</MuiTooltip>
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(13),
    border: '1px solid',
    borderColor: theme.palette.secondary.main,
  }
}));
