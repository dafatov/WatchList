import {FileDownloadOutlined, LogoutOutlined} from '@mui/icons-material';
import {memo, useCallback, useEffect, useState} from 'react';
import {Dialog} from '../../dialog/Dialog';
import {JsonDiff} from '../../jsonDiff/JsonDiff';
import {Login} from './login/Login';
import {SplitIconButton} from '../../splitIconButton/SplitIconButton';
import {SvgIcon} from '@mui/material';
import {ReactComponent as YandexDiskIcon} from '../../../assets/icons/yandexDisk.svg';
import {throwHttpError} from '../../../utils/reponse';
import {useLocalStorage} from '../../../utils/storage';
import {useSnackBar} from '../../../utils/snackBar';
import {useStyles} from './yandexStyles';
import {useTranslation} from 'react-i18next';

export const Yandex = memo(() => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showSuccess, showError} = useSnackBar();
  const [session, setSession] = useLocalStorage('yandexSession');
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/animes/import/yandex', {
      headers: {
        Authorization: `OAuth ${session.access_token}`,
      },
    }).then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setState(state => ({
          ...state,
          previous: data,
        }));
      }).catch(() => showError(t('web:page.animes.snackBar.yandex.import.error')));

    fetch('http://localhost:8080/api/animes')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setState(state => ({
          ...state,
          current: data,
        }));
      }).catch(() => showError(t('web:page.animes.error')));
  }, [setState, session, showError]);

  const handleExport = useCallback(() => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/animes/export/yandex', {
      method: 'POST',
      headers: {
        Authorization: `OAuth ${session.access_token}`,
      },
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
          onRightClick={() => setOpen(true)}
        />
        : <Login clientId={process.env.REACT_APP_YANDEX_CLIENT_ID} onSuccess={session => setSession(session)}/>}
      <Dialog
        open={open}
        setOpen={setOpen}
        onSubmit={handleExport}
        title={t('web:page.animes.modal.showDiff.title')}
        submitTitle={t('common:action.export')}
        classes={{content: classes.dialogContent}}
      >
        <JsonDiff
          previous={state.previous}
          current={state.current}
        />
      </Dialog>
    </>
  );
});

Yandex.displayName = 'Yandex';
