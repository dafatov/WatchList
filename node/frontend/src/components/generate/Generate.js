import {BrowserUpdatedOutlined, CancelPresentationOutlined, ResetTvOutlined} from '@mui/icons-material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {FileProgressTooltip} from '../fileProgressTooltip/FileProgressTooltip';
import {IconButton} from '../iconButton/IconButton';
import {LoadingIconButton} from '../loadingIconButton/LoadingIconButton';
import {IconButton as MuiIconButton} from '@mui/material';
import {throwHttpError} from '../../utils/reponse';
import {useInterval} from '../../utils/useInterval';
import {useSnackBar} from '../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const Generate = memo(({
  disabled,
  getRenderSize,
}) => {
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const [delay, setDelay] = useState(1000);
  const [localDisabled, setLocalDisabled] = useState(false);
  const [progress, setProgress] = useState({});

  useInterval(() => {
    updateProgress();
  }, delay, [setProgress]);

  useEffect(() => {
    switch (progress.status) {
      case 'IDLE':
        setDelay(null);
        return;
      case 'COMPLETED':
        setDelay(null);
        setLocalDisabled(false);
        return;
      case 'INTERRUPTED':
        setDelay(null);
        setLocalDisabled(false);
        return;
      case 'RUNNING':
        setLocalDisabled(false);
        break;
    }
  }, [progress.status, setDelay, setLocalDisabled]);

  const title = useMemo(() => {
    switch (progress.status) {
      case 'RUNNING':
        return t('common:action.stop');
      case 'COMPLETED':
      case 'INTERRUPTED':
        return t('common:action.reset');
    }
  }, [progress.status]);

  const color = useMemo(() => {
    if (progress.status === 'COMPLETED') {
      return 'success';
    }

    return 'error';
  }, [progress.status]);

  const updateProgress = useCallback(() => {
    fetch('http://localhost:8080/api/files/progress')
      .then(throwHttpError)
      .then(response => response.json())
      .then(progress => {
        setProgress(progress);
      }).catch(() => showError(t('web:page.animes.snackBar.generateFolder.error')));
  }, [setProgress, showError]);

  const handleGenerate = useCallback(() => {
    setLocalDisabled(true);
    fetch('http://localhost:8080/api/files/generate', {method: 'POST'})
      .then(throwHttpError)
      .then(() => {
        setDelay(1000);
      })
      .catch(() => {
        setLocalDisabled(false);
        showError(t('web:page.animes.snackBar.generateFolder.error'));
      });
  }, [setDelay, setLocalDisabled, showError]);

  const handleReset = useCallback(() => {
    fetch('http://localhost:8080/api/files/reset', {method: 'POST'})
      .then(throwHttpError)
      .then(() => {
        updateProgress();
      }).catch(() => showError(t('web:page.animes.generate.progress.error')));
  }, [updateProgress, showError]);

  const handleStop = useCallback(() => {
    fetch('http://localhost:8080/api/files/stop', {method: 'POST'})
      .then(throwHttpError)
      .then(() => {
        updateProgress();
      }).catch(() => showError(t('web:page.animes.generate.progress.error')));
  }, [updateProgress, showError]);

  return (
    <>
      {progress.status === 'IDLE'
        ? <IconButton
          title={t('common:action.generate')}
          disabled={disabled || localDisabled}
          onClick={handleGenerate}
        >
          <BrowserUpdatedOutlined/>
        </IconButton>
        : <FileProgressTooltip title={title} progress={progress} getRenderSize={getRenderSize}>
          {progress.status === 'RUNNING'
            ? <LoadingIconButton
              disabled={disabled || localDisabled}
              value={progress.percent}
              onClick={handleStop}
            >
              <ResetTvOutlined/>
            </LoadingIconButton>
            : <></>}
          {progress.status === 'COMPLETED' || progress.status === 'INTERRUPTED'
            ? <MuiIconButton
              color={color}
              disabled={disabled || localDisabled}
              onClick={handleReset}
            >
              <CancelPresentationOutlined/>
            </MuiIconButton>
            : <></>}
        </FileProgressTooltip>}
    </>
  );
});

Generate.displayName = 'Generate';
