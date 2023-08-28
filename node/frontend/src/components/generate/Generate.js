import {Badge, CircularProgress, IconButton as MuiIconButton} from '@mui/material';
import {BrowserUpdatedOutlined, CancelPresentationOutlined, ResetTvOutlined} from '@mui/icons-material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {FileProgressTooltip} from '../fileProgressTooltip/FileProgressTooltip';
import {IconButton} from '../iconButton/IconButton';
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

  const updateProgress = useCallback(() => {
    fetch('http://localhost:8080/api/files/progress')
      .then(throwHttpError)
      .then(response => response.json())
      .then(progress => {
        setProgress(progress);
      }).catch(() => showError(t('web:page.animes.snackBar.generateFolder.error')));
  }, [setProgress]);

  const handleGenerate = useCallback(() => {
    setLocalDisabled(true);
    fetch('http://localhost:8080/api/files/generate', {method: 'POST'})
      .then(throwHttpError)
      .then(() => {
        setDelay(1000);
        updateProgress();
      })
      .catch(() => {
        setLocalDisabled(false);
        showError(t('web:page.animes.snackBar.generateFolder.error'));
      });
  }, [setDelay, updateProgress, setLocalDisabled]);

  const handleReset = useCallback(() => {
    fetch('http://localhost:8080/api/files/reset', {method: 'POST'})
      .then(throwHttpError)
      .then(() => {
        updateProgress();
      }).catch(() => showError(t('web:page.animes.generate.progress.error')));
  }, [updateProgress]);

  const handleStop = useCallback(() => {
    fetch('http://localhost:8080/api/files/stop', {method: 'POST'})
      .then(throwHttpError)
      .then(() => {
        updateProgress();
      }).catch(() => showError(t('web:page.animes.generate.progress.error')));
  }, [updateProgress]);

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
            ? <Badge
              overlap="circular"
              badgeContent={
                <CircularProgress
                  color="primary"
                  size={20}
                  thickness={20}
                  variant="determinate"
                  value={progress.percent}
                />
              }>
              <MuiIconButton
                color="primary"
                disabled={disabled || localDisabled}
                onClick={handleStop}
              >
                <ResetTvOutlined/>
              </MuiIconButton>
            </Badge>
            : <></>}
          {progress.status === 'COMPLETED' || progress.status === 'INTERRUPTED'
            ? <MuiIconButton
              color={progress.status === 'COMPLETED'
                ? 'success'
                : 'error'}
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

Generate.displayName = 'Generator';
