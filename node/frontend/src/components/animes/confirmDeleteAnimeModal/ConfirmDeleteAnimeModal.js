import {memo, useCallback} from 'react';
import {Dialog} from '../../modal/Dialog';
import {DialogContentText} from '@mui/material';
import {useTranslation} from 'react-i18next';

export const ConfirmDeleteAnimeModal = memo(({
  open,
  setOpen,
  onSubmit,
  anime,
}) => {
  const {t} = useTranslation();

  const handleSubmit = useCallback(() => {
    onSubmit(anime?.id);
  }, [anime, onSubmit]);

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      title={t('web:page.animes.modal.confirmDeleteAnimeModal.title')}
      submitTitle={t('common:action.delete')}
    >
      <DialogContentText>
        {t('web:page.animes.modal.confirmDeleteAnimeModal.text', {anime})}
      </DialogContentText>
    </Dialog>
  );
});

ConfirmDeleteAnimeModal.displayName = 'ConfirmDeleteAnimeModal';
