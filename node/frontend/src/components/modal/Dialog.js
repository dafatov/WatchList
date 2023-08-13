import {Button, DialogActions, DialogContent, DialogTitle, Dialog as MuiDialog} from '@mui/material';
import {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

export const Dialog = memo(({
  children,
  open,
  setOpen,
  onSubmit,
  title,
  submitTitle,
}) => {
  const {t} = useTranslation();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit();
  }, [onSubmit, setOpen]);

  return (
    <MuiDialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common:action.cancel')}</Button>
        <Button onClick={handleSubmit}>{submitTitle}</Button>
      </DialogActions>
    </MuiDialog>
  );
});

Dialog.displayName = 'Dialog';
