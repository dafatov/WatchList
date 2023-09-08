import {IconButton as MuiIconButton} from '@mui/material';
import {Tooltip} from '../tooltip/Tooltip';
import {memo} from 'react';

export const IconButton = memo(({
  children,
  title,
  disabled = false,
  onClick,
  ...props
}) => {
  return (
    <Tooltip disableInteractive title={title}>
      <MuiIconButton
        color="primary"
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </MuiIconButton>
    </Tooltip>
  );
});

IconButton.displayName = 'IconButton';
