import {FileDownloadOutlined, LogoutOutlined} from '@mui/icons-material';
import {memo, useCallback} from 'react';
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
  const [session, setSession] = useLocalStorage('shikimoriSession');

  const handleExport = useCallback(() => {
    fetch('http://localhost:8080/api/animes/export/yandex', {
      method: 'POST',
      headers: {
        Authorization: `OAuth ${session.access_token}`,
      }
    }).then(throwHttpError)
      .then(() => showSuccess(t('web:page.animes.snackBar.yandex.export.success')))
      .catch(() => showError(t('web:page.animes.snackBar.yandex.export.error')));
  });

  return (
    <>
      {session
        ? <SplitIconButton
          mainIcon={<SvgIcon component={YandexDiskIcon}/>}
          leftIcon={<LogoutOutlined/>}
          rightIcon={<FileDownloadOutlined/>}
          onLeftClick={() => setSession(null)}
          onRightClick={handleExport}
        />
        : <Login clientId="c4d5fd5fcd2d4bbc81bfb17bf840fd44" onSuccess={session => setSession(session)}/>}
    </>
  );
});

Yandex.displayName = 'Yandex';
