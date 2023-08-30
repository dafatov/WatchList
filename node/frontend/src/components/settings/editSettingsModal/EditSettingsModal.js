import {Button, FormGroup} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {Dialog} from '../../modal/Dialog';
import {Folder} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';

export const EditSettingsModal = memo(({
  open,
  setOpen,
  onSubmit,
  initialValues,
}) => {
  const {t} = useTranslation();
  const [values, setValues] = useState(initialValues ?? {});

  useEffect(() => {
    setValues(initialValues ?? {});
  }, [initialValues, setValues]);

  const handlePickFolder = useCallback(() => {
    window.postMessage({
      type: 'select-dir-in',
    });
    window.addEventListener('message', event => {
      if (event.data.type === 'select-dir-out') {
        setValues(values => ({
          ...values,
          'default-setting.file-service.target-folder': event.data.data[0],
        }));
      }
    });
  }, [setValues]);

  const handleClose = useCallback(() => {
    setValues(initialValues ?? {});
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
      title={t('web:page.animes.modal.editSettingsModal.title')}
      submitTitle={t('common:action.apply')}
    >
      <FormGroup>
        <Button
          variant="outlined"
          startIcon={<Folder/>}
          onClick={handlePickFolder}
        >
          {values?.['default-setting.file-service.target-folder']}
        </Button>
      </FormGroup>
    </Dialog>
  );
});

EditSettingsModal.displayName = 'EditSettingsModal';
