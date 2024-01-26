import {Checkbox, Divider, FormControlLabel, FormGroup} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {Dialog} from '../../dialog/Dialog';
import {union} from 'lodash';
import {useTranslation} from 'react-i18next';

/**
 * @type {React.NamedExoticComponent<{readonly initialValues?: [string], readonly setOpen: Function, readonly onSubmit: Function, readonly open: boolean,
 *   readonly episodes: number}>}
 */
export const EditSupplementEpisodesModal = memo(({
  open,
  setOpen,
  episodes = 0,
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
  }, [setValues]);

  const handleChangeAll = useCallback(() => {
    setValues(values => values.length === episodes
      ? []
      : Array(episodes).fill(null)
        .map((_, index) => index + 1));
  }, [episodes, setValues]);

  const handleClose = useCallback(() => {
    setValues(initialValues ?? []);
  }, [setValues, initialValues]);

  const handleSubmit = useCallback(() => {
    setOpen(false);
    onSubmit(values);
  }, [values, onSubmit, setOpen]);

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={t('web:page.animes.modal.supplementEpisodesModal.title')}
      submitTitle={t('common:action.apply')}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              onChange={() => handleChangeAll()}
              indeterminate={values.length > 0 && values.length < episodes}
              checked={values.length === episodes}
            />
          }
          label={t('common:action.selectAll')}
        />
        <Divider/>
        {Array(episodes).fill(null)
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
