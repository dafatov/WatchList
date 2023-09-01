import {ShuffleOnOutlined, ShuffleOutlined} from '@mui/icons-material';
import {memo, useCallback} from 'react';
import {IconButton} from '../../iconButton/IconButton';
import {throwHttpError} from '../../../utils/reponse';
import {useSnackBar} from '../../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const Shuffle = memo(({
  indexes,
  setIndexes,
  editableId,
  onStart,
  onStop,
}) => {
  const {t} = useTranslation();
  const {showError} = useSnackBar();

  const handleShuffleAnimes = useCallback(() => {
    fetch('http://localhost:8080/api/animes/shuffle')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setIndexes(data);
        onStart?.();
      }).catch(() => showError(t('web:page.animes.shuffle.error')));
  }, [setIndexes, onStart]);

  const handleUnshuffleAnimes = useCallback(() => {
    setIndexes(null);
    onStop?.();
  }, [setIndexes, onStop]);

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
    </>
  );
});

Shuffle.displayName = 'Shuffle';
