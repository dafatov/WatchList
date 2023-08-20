import {Checkbox, FormControlLabel, FormGroup} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {Dialog} from '../../modal/Dialog';
import {union} from 'lodash';
import {useTranslation} from 'react-i18next';

/**
 * @type {React.NamedExoticComponent<{readonly initialValues?: [string], readonly setOpen: Function, readonly onSubmit: Function, readonly open: boolean,
 *   readonly episodes: number}>}
 */
export const EditSupplementEpisodesModal = memo(({
  open,
  setOpen,
  episodes,
  onSubmit,
  initialValues,
}) => {
  const {t} = useTranslation();
  const [values, setValues] = useState(initialValues ?? []);

  useEffect(() => {
    setValues(initialValues ?? []);
  }, [initialValues, setValues]);

  const handleChange = useCallback((index, isChecked) => {
    setValues(values => isChecked
      ? union(values, [index + 1])
      : values.filter(value => value !== index + 1));
  }, [setValues, values]);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit(values);
  }, [values, onSubmit, setOpen]);

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
                  checked={values.includes(index + 1)}
                />
              }
              label={index + 1}
            />)}
      </FormGroup>
    </Dialog>
  );
});

EditSupplementEpisodesModal.displayName = 'EditSupplementEpisodesModal';
