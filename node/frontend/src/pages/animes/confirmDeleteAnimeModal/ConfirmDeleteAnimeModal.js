import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

export const ConfirmDeleteAnimeModal = memo(({
  open,
  setOpen,
  onSubmit,
  anime,
}) => {
  const {t} = useTranslation();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit(anime?.id);
  }, [anime, setOpen, onSubmit]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('web:page.animes.modal.confirmDeleteAnimeModal.title')}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          {t('web:page.animes.modal.confirmDeleteAnimeModal.text', {anime})}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common:action.cancel')}</Button>
        <Button color="error" onClick={handleSubmit}>{t('common:action.delete')}</Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmDeleteAnimeModal.displayName = 'ConfirmDeleteAnimeModal';
