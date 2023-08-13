import {Checkbox, FormControlLabel, FormGroup} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {pull, union} from 'lodash';
import {Dialog} from '../../modal/Dialog';
import {useTranslation} from 'react-i18next';

/**
 * @type {React.NamedExoticComponent<{readonly supplements?: [{id: *}], readonly setOpen?: Function, readonly onSubmit?: Function, readonly id?: *, readonly
 *   open?: boolean, readonly episodes?: number}>}
 */
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

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit({id, supplement});
  }, [supplement, onSubmit, setOpen]);

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      title={t('web:page.animes.modal.supplementEpisodesModal.title')}
      submitTitle={t('common:action.add')}
    >
      <FormGroup>
        {Array(episodes).fill()
          .map((_, index) =>
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  onChange={(_, checked) => handleChange(index, checked)}
                  checked={(supplement?.episodes ?? []).includes(index + 1)}
                />
              }
              label={index + 1}
            />)}
      </FormGroup>
    </Dialog>
  );
});

EditSupplementEpisodesModal.displayName = 'EditSupplementEpisodesModal';
