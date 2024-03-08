import {Badge, Button, Divider, InputAdornment, TextField} from '@mui/material';
import {ContentCopyOutlined, FiberNewOutlined, MenuOutlined, OpenInNew, SyncOutlined} from '@mui/icons-material';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {IconButton} from '../iconButton/IconButton';
import {Menu} from '../menu/Menu';
import {Tooltip} from '../tooltip/Tooltip';
import {getComponentsFromObject} from '../../utils/component';
import {throwHttpError} from '../../utils/reponse';
import {useSnackBar} from '../../utils/snackBar';
import {useStyles} from './urlLinkStyles';
import {useTranslation} from 'react-i18next';

export const UrlLink = (({
  editable,
  name: nameProp,
  url: urlProp,
  isNew,
  formik,
  onClick,
  onCopyName,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState(nameProp);
  const [url, setUrl] = useState(urlProp);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(nameProp);
  }, [editable, nameProp, setName]);

  useEffect(() => {
    setUrl(urlProp);
  }, [editable, urlProp, setUrl]);

  const getError = useCallback(name => {
    return formik.touched[name] && formik.errors[name];
  }, [formik.touched, formik.errors]);

  const handleNameChange = useCallback(event => {
    setName(event.target.value);
    formik.handleChange(event);
  }, [setName, formik.handleChange]);

  const handleUrlChange = useCallback(event => {
    setUrl(event.target.value);
    formik.handleChange(event);
  }, [setUrl, formik.handleChange]);

  const handleSync = useCallback(() => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/files/rename?' + new URLSearchParams({
      path: formik.values.path,
      name,
    }), {
      method: 'POST',
    }).then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        formik.setFieldValue('path', data.path);
        setName(data.name);
      }).catch(() => showError(t('web:page.animes.snackBar.renameFolder.error')))
      .finally(() => setIsLoading(false));
  }, [setIsLoading, showError, formik.values.path, name, formik.setFieldValue]);

  const actions = useMemo(() => ({
    sync: <IconButton
      title={t('common:action.sync')}
      disabled={!name || isLoading}
      onClick={() => handleSync()}
    >
      <SyncOutlined/>
    </IconButton>,
  }), [name, isLoading, handleSync]);

  return (
    <>
      {editable
        ? <div className={classes.editableContainer}>
          <TextField
            name="name"
            value={name}
            onChange={handleNameChange}
            onBlur={formik.handleBlur}
            error={!!getError('name')}
            label={getError('name')}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <Menu
                    mainIcon={<MenuOutlined/>}
                    menuRootHoveredClassName={classes.dialRootHovered}
                    menuActionsHoveredClassName={classes.dialActionsHovered}
                  >
                    {getComponentsFromObject(actions)}
                  </Menu>
                </InputAdornment>,
            }}
          />
          <TextField
            name="url"
            value={url}
            className={classes.url}
            onChange={handleUrlChange}
            onBlur={formik.handleBlur}
            error={!!getError('url')}
            label={getError('url')}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    title={url}
                    disabled={!url || getError('url')}
                    onClick={onClick}
                  >
                    <OpenInNew/>
                  </IconButton>
                </InputAdornment>,
            }}
          />
        </div>
        : <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classes.container}
        >
          <Tooltip title={url}>
            <Badge
              badgeContent={<FiberNewOutlined color="success"/>}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              invisible={!isNew}
              className={classes.badge}
            >
              <Button
                variant="text"
                color="primary"
                disabled={!url}
                onClick={onClick}
                className={classes.button}
              >
                {name}
              </Button>
            </Badge>
          </Tooltip>
          {isHovered
            ? <>
              <Divider flexItem orientation="vertical"/>
              <IconButton
                title={t('common:action.copyToClipboard')}
                disabled={!name}
                onClick={() => onCopyName?.()}
                className={classes.copyButton}
              >
                <ContentCopyOutlined/>
              </IconButton>
            </>
            : <></>}
        </div>
      }
    </>
  );
});

UrlLink.displayName = 'UrlLink';
