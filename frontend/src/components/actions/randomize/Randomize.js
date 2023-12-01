import {CancelOutlined, FileDownloadOutlined, SignpostOutlined, SyncOutlined} from '@mui/icons-material';
import {List, ListItemText} from '@mui/material';
import {memo, useCallback, useMemo, useState} from 'react';
import {IconButton} from '../../iconButton/IconButton';
import {Tooltip} from '../../tooltip/Tooltip';
import classNames from 'classnames';
import {createWatchingList} from '../../../utils/image';
import {throwHttpError} from '../../../utils/reponse';
import {useLocalStorage} from '../../../utils/storage';
import {useSnackBar} from '../../../utils/snackBar';
import {useStyles} from './randomizeStyles';
import {useTranslation} from 'react-i18next';

export const Randomize = memo(({
  active,
  onStart,
  onStop,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [randomize, setRandomize] = useLocalStorage('randomize');

  const randomizeImage = useMemo(() => {
    if (!randomize) {
      return '';
    }

    return createWatchingList(t('web:page.animes.table.status.enum.WATCHING'), randomize);
  }, [randomize]);

  const handleUpdateRandomizeAnimes = useCallback(() => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/animes/randomize', {method: 'POST'})
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setRandomize(data);

        if (!active) {
          onStart?.();
        }
      }).catch(() => showError(t('web:page.animes.snackBar.randomize.update.error')))
      .finally(() => setIsLoading(false));
  }, [setRandomize, onStart, setIsLoading]);

  const handleCancelRandomizeAnimes = useCallback(() => {
    setRandomize(null);
    onStop?.();
  }, [setRandomize, onStop]);

  const handleImportRandomizeAnimes = useCallback(() => {
    const link = document.createElement('a');
    link.setAttribute('href', randomizeImage);
    link.setAttribute('download', 'watching.png');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }, [randomizeImage, handleCancelRandomizeAnimes]);

  return (
    <>
      {active
        ? <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classNames({[classes.dialRoot]: isHovered})}
        >
          <div className={classNames(classes.dialActions, {[classes.dialActionsHoveredTop]: isHovered})}>

            <Tooltip
              disableInteractive
              placement="left"
              title={<img src={randomizeImage} alt="randomizeImage" className={classes.previewRandomize}/>}
            >
              <span>
                <IconButton onClick={() => handleImportRandomizeAnimes()}>
                  <FileDownloadOutlined/>
                </IconButton>
              </span>
            </Tooltip>
          </div>
          <Tooltip
            disableInteractive
            placement="left"
            title={
              <List>
                {randomize?.map((name, index) =>
                  <ListItemText key={index}>{name}</ListItemText>)}
              </List>
            }
          >
            <span>
              <IconButton
                disabled={isLoading}
                onClick={() => handleUpdateRandomizeAnimes()}
              >
                {isHovered
                  ? <SyncOutlined/>
                  : <SignpostOutlined/>}
              </IconButton>
            </span>
          </Tooltip>
          <div className={classNames(classes.dialActions, {[classes.dialActionsHoveredBottom]: isHovered})}>
            <IconButton
              title={t('common:action.cancel')}
              onClick={() => handleCancelRandomizeAnimes()}
            >
              <CancelOutlined/>
            </IconButton>
          </div>
        </div>
        : <IconButton
          title={t('common:action.randomize.on')}
          onClick={() => handleUpdateRandomizeAnimes()}
        >
          <SignpostOutlined/>
        </IconButton>}
    </>
  );
});

Randomize.displayName = 'Randomize';
