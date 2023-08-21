import {Button, Divider, TextField} from '@mui/material';
import {useCallback, useEffect, useState} from 'react';
import {ContentCopyOutlined} from '@mui/icons-material';
import {IconButton} from '../iconButton/IconButton';
import {Tooltip} from '../tooltip/Tooltip';
import {useTranslation} from 'react-i18next';

export const UrlLink = (({
  editable,
  name: nameProp,
  url: urlProp,
  formik,
  onClick,
  onCopyName,
}) => {
  const {t} = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState(nameProp);
  const [url, setUrl] = useState(urlProp);

  useEffect(() => {
    setName(nameProp);
  }, [editable, nameProp, setName]);

  useEffect(() => {
    setUrl(urlProp);
  }, [editable, urlProp, setUrl]);

  const handleNameChange = useCallback(event => {
    setName(event.target.value);
    formik.handleChange(event);
  }, [setName, formik.handleChange]);

  const handleUrlChange = useCallback(event => {
    setUrl(event.target.value);
    formik.handleChange(event);
  }, [setUrl, formik.handleChange]);

  return (
    <>
      {editable
        ? <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            name="name"
            value={name}
            onChange={handleNameChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && !!formik.errors.name}
            label={formik.touched.name && formik.errors.name && <>{formik.errors.name}</>}
          />
          <TextField
            name="url"
            value={url}
            onChange={handleUrlChange}
            onBlur={formik.handleBlur}
            error={formik.touched.url && !!formik.errors.url}
            label={formik.touched.url && formik.errors.url && <>{formik.errors.url}</>}
          />
        </div>
        : <div
          onMouseLeave={() => setIsHovered(false)}
          onMouseEnter={() => setIsHovered(true)}
          style={{display: 'flex', flexDirection: 'row'}}
        >
          <Tooltip title={url}>
            <Button
              variant="text"
              color="primary"
              disabled={!url}
              onClick={onClick}
              style={{textAlign: 'justify'}}
            >
              {name}
            </Button>
          </Tooltip>
          {isHovered
            ? <>
              <Divider flexItem orientation="vertical"/>
              <IconButton
                title={t('common:action.copyToClipboard')}
                disabled={!name}
                onClick={() => onCopyName?.()}
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
