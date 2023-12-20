import {FileDownloadOutlined, LogoutOutlined} from '@mui/icons-material';
import {memo, useCallback, useState} from 'react';
import {Login} from './login/Login';
import {SplitIconButton} from '../../splitIconButton/SplitIconButton';
import {SvgIcon} from '@mui/material';
import {ReactComponent as YandexDiskIcon} from '../../../assets/icons/yandexDisk.svg';
import {throwHttpError} from '../../../utils/reponse';
import {useLocalStorage} from '../../../utils/storage';
import {useSnackBar} from '../../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const Yandex = memo(() => {
  const {t} = useTranslation();
  const {showSuccess, showError} = useSnackBar();
  const [session, setSession] = useLocalStorage('yandexSession');
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = useCallback(() => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/animes/export/yandex', {
      method: 'POST',
      headers: {
        Authorization: `OAuth ${session.access_token}`,
      }
    }).then(throwHttpError)
      .then(() => showSuccess(t('web:page.animes.snackBar.yandex.export.success')))
      .catch(() => showError(t('web:page.animes.snackBar.yandex.export.error')))
      .finally(() => setIsLoading(false));
  }, [setIsLoading, showSuccess, showError, session]);

  return (
    <>
      {session
        ? <SplitIconButton
          disabled={isLoading}
          mainIcon={<SvgIcon component={YandexDiskIcon}/>}
          leftIcon={<LogoutOutlined/>}
          rightIcon={<FileDownloadOutlined/>}
          leftTitle={t('common:action.logout')}
          rightTitle={t('common:action.export')}
          onLeftClick={() => setSession(null)}
          onRightClick={handleExport}
        />
        : <Login clientId={process.env.REACT_APP_YANDEX_CLIENT_ID} onSuccess={session => setSession(session)}/>}
    </>
  );
});

Yandex.displayName = 'Yandex';
