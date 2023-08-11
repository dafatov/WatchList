import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {pull, union} from 'lodash';
import {useTranslation} from 'react-i18next';

export const EditSupplementEpisodesModal = memo(({
  open,
  setOpen,
  onSubmit,
  supplements,
  id,
  episodes,
}) => {
  const {t} = useTranslation();
  const [supplement, setSupplement] = useState(null);

  useEffect(() => {
    setSupplement(supplements?.find(supplement => supplement.id === id));
  }, [id, supplements, setSupplement]);

  const handleChange = useCallback((index, isChecked) => {
    const newEpisodes = isChecked
      ? union(supplement.episodes, [index + 1])
      : pull(supplement.episodes, index + 1);

    setSupplement({
      ...supplement,
      episodes: newEpisodes,
    });
  }, [setSupplement, supplement]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit(supplement, id);
  }, [supplement, onSubmit, setOpen]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('web:page.animes.modal.supplementEpisodesModal.title')}</DialogTitle>
      <DialogContent dividers>
        <FormGroup>
          {Array(episodes).fill(undefined)
            .map((_, index) =>
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    onChange={(_, checked) => handleChange(index, checked)}
                    checked={supplement?.episodes.includes(index + 1)}
                  />
                }
                label={index + 1}
              />)}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common:action.cancel')}</Button>
        <Button onClick={handleSubmit}>{t('common:action.add')}</Button>
      </DialogActions>
    </Dialog>
  );
});

EditSupplementEpisodesModal.displayName = 'EditSupplementEpisodesModal';
