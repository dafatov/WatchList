import {memo} from 'react';
import {useTranslation} from 'react-i18next';

export const Landing = memo(() => {
  const {t} = useTranslation();

  return (
    <>{t('web:test.test.test')}</>
  );
});

Landing.displayName = 'Landing';
