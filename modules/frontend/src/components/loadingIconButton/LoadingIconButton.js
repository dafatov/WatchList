import {Badge, CircularProgress, IconButton as MuiIconButton} from '@mui/material';
import {memo} from 'react';

export const LoadingIconButton = memo(({
  children,
  disabled,
  value,
  onClick,
}) => {
  return (
    <Badge
      overlap="circular"
      badgeContent={
        <CircularProgress
          color="primary"
          size={20}
          thickness={20}
          variant="determinate"
          value={value}
        />
      }>
      <MuiIconButton
        color="primary"
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </MuiIconButton>
    </Badge>
  );
});

LoadingIconButton.displayName = 'LoadingIconButton';
