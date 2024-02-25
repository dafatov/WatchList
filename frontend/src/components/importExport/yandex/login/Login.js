import {getAccessKey, getCurrentOrigin} from '../../../../utils/reponse';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {IconButton} from '../../../iconButton/IconButton';
import {LoginOutlined} from '@mui/icons-material';
import {SvgIcon} from '@mui/material';
import {ReactComponent as YandexDiskIcon} from '../../../../assets/icons/yandexDisk.svg';
import {useStyles} from './loginStyles';
import {useTranslation} from 'react-i18next';

export const Login = memo(({
  clientId,
  onSuccess,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const accessKey = useMemo(() => getAccessKey(window.location.href), [getAccessKey, window.location.href]);
  const receiver = useMemo(() => window.parent === window
    ? window.opener
    : window.parent, [window]);

  useEffect(() => {
    if (accessKey && receiver) {
      receiver.postMessage({
        source: 'yandex-login',
        payload: accessKey,
      }, window.location.origin);

      window.close();
    }
  }, [accessKey, receiver, window.location.origin, window.close]);

  const handleClick = useCallback(() => {
    const currentOrigin = getCurrentOrigin(window.location.origin);
    const requestUrl = 'https://oauth.yandex.ru/authorize?' + new URLSearchParams({
      response_type: 'token',
      client_id: clientId,
      redirect_uri: encodeURI(currentOrigin),
      display: 'popup',
    });
    const {h, w} = {h: 650, w: 550};
    const {x, y} = {
      x: window.top.outerWidth / 2 + window.top.screenX - (w / 2),
      y: window.top.outerHeight / 2 + window.top.screenY - (h / 2),
    };
    const handleMessage = event => {
      if (event.data.source === 'yandex-login') {
        window.removeEventListener('message', handleMessage);
        onSuccess?.(event.data.payload);
      }
    };

    window.open(requestUrl, 'popup', `width=${w},height=${h},top=${y},left=${x}`);
    window.addEventListener('message', handleMessage);
  }, [clientId, onSuccess]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={classes.root}
    >
      {isHovered
        ? <IconButton
          title={t('common:action.login')}
          onClick={handleClick}
          className={classes.login}
        >
          <LoginOutlined/>
        </IconButton>
        : <IconButton onClick={() => setIsHovered(true)}>
          <SvgIcon component={YandexDiskIcon}/>
        </IconButton>}
    </div>
  );
});

Login.displayName = 'Login';
