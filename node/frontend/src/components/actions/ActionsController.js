import {ShuffleOnOutlined, ShuffleOutlined} from '@mui/icons-material';
import {memo, useCallback} from 'react';
import {Generate} from '../generate/Generate';
import {IconButton} from '../iconButton/IconButton';
import {SettingsController} from '../settings/SettingsController';
import {throwHttpError} from '../../utils/reponse';
import {useSnackBar} from '../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const ActionsController = memo(({
  indexes,
  setIndexes,
  editableId,
  getRenderSize,
}) => {
  const {t} = useTranslation();
  const {showError} = useSnackBar();

  const handleShuffleAnimes = useCallback(() => {
    fetch('http://localhost:8080/api/animes/shuffle')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setIndexes(data);
      }).catch(() => showError(t('web:page.animes.shuffle.error')));
  }, [setIndexes]);

  const handleUnshuffleAnimes = useCallback(() => {
    setIndexes(null);
  }, [setIndexes]);

  return (
    <>
      {indexes
        ? <IconButton
          title={t('common:action.shuffle.off')}
          disabled={!!editableId}
          onClick={() => handleUnshuffleAnimes()}
        >
          <ShuffleOnOutlined/>
        </IconButton>
        : <IconButton
          title={t('common:action.shuffle.on')}
          disabled={!!editableId}
          onClick={() => handleShuffleAnimes()}
        >
          <ShuffleOutlined/>
        </IconButton>}
      <Generate
        disabled={!!indexes}
        getRenderSize={getRenderSize}
      />
      <SettingsController/>
    </>
  );
});

ActionsController.displayName = 'ActionsController';
