import {memo, useCallback} from 'react';
import {Popover as MuiPopover} from '@mui/material';

export const Popover = memo(({
  children,
  anchorEl,
  setAnchorEl,
  onClose,
}) => {
  const handleClose = useCallback(() => {
    setAnchorEl(null);
    onClose?.();
  }, [setAnchorEl, onClose]);

  return (
    <MuiPopover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {children}
    </MuiPopover>
  );
});

Popover.displayName = 'Popover';
