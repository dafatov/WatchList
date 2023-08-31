import {Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {memo, useCallback} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

export const NotFound = memo(() => {
  const {t} = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const handleToMain = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <Card>
      <CardContent>
        <Stack
          direction="column"
          spacing={2}
        >
          <Typography align="center" variant="h1">{t('web:page.notFound.title')}</Typography>
          <Typography>{t('web:page.notFound.description', {path: location.pathname})}</Typography>
          <Button onClick={handleToMain}>{t('common:navigation.toMain')}</Button>
        </Stack>
      </CardContent>
    </Card>
  );
});

NotFound.displayName = 'NotFound';
