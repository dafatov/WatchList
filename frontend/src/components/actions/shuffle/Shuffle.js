import {CancelOutlined, CheckCircleOutline, ShuffleOnOutlined, ShuffleOutlined} from '@mui/icons-material';
import {memo, useCallback, useState} from 'react';
import {IconButton} from '../../iconButton/IconButton';
import {IconButton as MuiIconButton} from '@mui/material';
import classNames from 'classnames';
import {throwHttpError} from '../../../utils/reponse';
import {useSnackBar} from '../../../utils/snackBar';
import {useStyles} from './shuffleStyles';
import {useTranslation} from 'react-i18next';

export const Shuffle = memo(({
  indexes,
  setIndexes,
  setPicked,
  editableId,
  onStart,
  onStop,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const [isHovered, setIsHovered] = useState(false);

  const handleShuffleAnimes = useCallback(() => {
    fetch('http://localhost:8080/api/animes/shuffle')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setIndexes(data);
        onStart?.();
      }).catch(() => showError(t('web:page.animes.shuffle.error')));
  }, [setIndexes, onStart]);

  const handlePickShuffleAnimes = useCallback(() => {
    fetch('http://localhost:8080/api/animes/pick', {method: 'POST'})
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setIndexes(null);
        setPicked(data);
        onStop?.();
      }).catch(() => showError(t('web:page.animes.snackBar.shuffle.pick.error')));
  }, [setIndexes, setPicked, onStop]);

  const handleCancelShuffleAnimes = useCallback(() => {
    setIndexes(null);
    onStop?.();
  }, [setIndexes, onStop]);

  return (
    <>
      {indexes
        ? <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classNames({[classes.dialRoot]: isHovered})}
        >
          <div className={classNames(classes.dialActions, {[classes.dialActionsHoveredTop]: isHovered})}>
            <IconButton
              title={t('common:action.shuffle.check')}
              onClick={handlePickShuffleAnimes}
            >
              <CheckCircleOutline/>
            </IconButton>
          </div>
          <MuiIconButton disabled={isHovered} color="primary">
            <ShuffleOnOutlined/>
          </MuiIconButton>
          <div className={classNames(classes.dialActions, {[classes.dialActionsHoveredBottom]: isHovered})}>
            <IconButton
              title={t('common:action.shuffle.cancel')}
              onClick={handleCancelShuffleAnimes}
            >
              <CancelOutlined/>
            </IconButton>
          </div>
        </div>
        : <IconButton
          title={t('common:action.shuffle.on')}
          disabled={!!editableId}
          onClick={() => handleShuffleAnimes()}
        >
          <ShuffleOutlined/>
        </IconButton>}
    </>
  );
});

Shuffle.displayName = 'Shuffle';
