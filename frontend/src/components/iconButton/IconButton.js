import {IconButton as MuiIconButton} from '@mui/material';
import {Tooltip} from '../tooltip/Tooltip';
import {memo} from 'react';

export const IconButton = memo(({
  children,
  title,
  disabled = false,
  onClick,
  ...props
}) => (
  <Tooltip disableInteractive title={!disabled && title}>
    <span>
      <MuiIconButton
        color="primary"
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </MuiIconButton>
    </span>
  </Tooltip>
));

IconButton.displayName = 'IconButton';
