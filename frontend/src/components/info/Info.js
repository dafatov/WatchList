import {Badge, CircularProgress, Divider} from '@mui/material';
import {memo, useEffect, useMemo, useState} from 'react';
import {IconButton} from '../iconButton/IconButton';
import {InfoOutlined} from '@mui/icons-material';
import {styled} from '@mui/material/styles';
import {throwHttpError} from '../../utils/reponse';
import {useSnackBar} from '../../utils/snackBar';
import {useTranslation} from 'react-i18next';

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    border: '2px solid #272727',
    padding: '0 4px',
    left: 1,
    bottom: 1,
  },
}));

export const Info = memo(({editableId}) => {
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/animes/info')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setInfo(data);
      }).catch(() => showError(t('web:page.animes.info.error')));
  }, [editableId, setInfo, showError]);

  const color = useMemo(() => {
    if (info?.candidates === 0) {
      return 'success';
    }

    if (info?.candidates < 0) {
      return 'error';
    }

    return 'primary';
  }, [info?.candidates]);

  return (
    <>
      <Divider flexItem orientation="vertical"/>
      <IconButton
        title={info
          ? t('web:page.animes.table.name.info', {info})
          : <CircularProgress size="24px" color="secondary"/>}
      >
        <StyledBadge
          color={color}
          overlap="circular"
          invisible={!info?.candidates}
          badgeContent={info?.candidates}
        >
          <InfoOutlined color={color}/>
        </StyledBadge>
      </IconButton>
    </>
  );
});

Info.displayName = 'Info';
