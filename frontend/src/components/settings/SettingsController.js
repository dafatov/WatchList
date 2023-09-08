import {memo, useCallback, useEffect, useState} from 'react';
import {EditSettingsModal} from './editSettingsModal/EditSettingsModal';
import {IconButton} from '../iconButton/IconButton';
import {SettingsOutlined} from '@mui/icons-material';
import {throwHttpError} from '../../utils/reponse';
import {useSnackBar} from '../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const SettingsController = memo(() => {
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const [open, setOpen] = useState(false);
  const [configs, setConfigs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/configs')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setConfigs(data);
        setIsLoading(false);
      }).catch(() => showError(t('web:page.animes.error')));
  }, []);

  const handleSubmit = useCallback(data => {
    fetch('http://localhost:8080/api/configs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setConfigs(data);
        setIsLoading(false);
      }).catch(() => showError(t('web:page.animes.error')));
  }, [setConfigs, setIsLoading]);

  return (
    <>
      <IconButton
        title={t('common:action.settings')}
        disabled={isLoading}
        onClick={() => setOpen(true)}
      >
        <SettingsOutlined/>
      </IconButton>
      <EditSettingsModal
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
        initialValues={configs}
      />
    </>
  );
});

SettingsController.displayName = 'SettingsController';
