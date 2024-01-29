import {InputAdornment, TextField} from '@mui/material';
import {MenuOutlined, OpenInNew, SyncOutlined} from '@mui/icons-material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {IconButton} from '../iconButton/IconButton';
import {Menu} from '../menu/Menu';
import {getComponentsFromObject} from '../../utils/component';
import {throwHttpError} from '../../utils/reponse';
import {useSnackBar} from '../../utils/snackBar';
import {useStyles} from './pathLinkStyles';
import {useTranslation} from 'react-i18next';

export const PathLink = memo(({
  editable,
  value: valueProp,
  formik,
  name,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showError, showSuccess} = useSnackBar();
  const [value, setValue] = useState(valueProp);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(valueProp);
  }, [editable, valueProp, setValue]);

  const handleChange = useCallback(event => {
    setValue(event.target.value);
    formik.handleChange(event);
  }, [setValue, formik.handleChange]);

  const handleSync = useCallback(() => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/files/info?' + new URLSearchParams({
      path: value,
    })).then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        formik.setFieldValue('episodes', data.episodes);
        formik.setFieldValue('size', data.size);
        formik.setFieldValue('name', data.name);
        formik.setFieldValue('supplements', data.supplements);
      }).then(() => showSuccess(t('web:page.animes.snackBar.sync.success')))
      .catch(() => showError(t('web:page.animes.snackBar.sync.error')))
      .finally(() => setIsLoading(false));
  }, [formik.setFieldValue, setIsLoading, value]);

  const handleOpenFile = useCallback(() => {
    fetch('http://localhost:8080/api/files/open/folder?' + new URLSearchParams({
      path: value,
    }), {
      method: 'POST',
    }).then(throwHttpError)
      .catch(() => showError(t('web:page.animes.snackBar.openFolder.error')));
  }, [value]);

  const error = useMemo(() => {
    return formik.touched[name] && formik.errors[name];
  }, [formik.touched[name], formik.errors[name]]);

  const openFileButton = useMemo(() => (
    <IconButton
      title={value}
      disabled={!value}
      onClick={() => handleOpenFile()}
    >
      <OpenInNew/>
    </IconButton>
  ), [value, handleOpenFile]);

  const actions = useMemo(() => ({
    sync: <IconButton
      title={t('common:action.sync')}
      disabled={!value || isLoading}
      onClick={() => handleSync()}
    >
      <SyncOutlined/>
    </IconButton>,
  }), [value, isLoading, handleSync]);

  return (
    <>
      {editable
        ? <TextField
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={!!error}
          label={error}
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                <Menu
                  mainIcon={<MenuOutlined/>}
                  menuRootHoveredClassName={classes.dialRootHovered}
                  menuActionsHoveredClassName={classes.dialActionsHovered}
                >
                  {getComponentsFromObject(actions)}
                </Menu>
              </InputAdornment>,
            endAdornment:
              <InputAdornment position="end">
                {openFileButton}
              </InputAdornment>,
          }}
        />
        : openFileButton}
    </>
  );
});

PathLink.displayName = 'PathLink';
