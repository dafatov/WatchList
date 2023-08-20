import {TextField, Typography} from '@mui/material';
import {useCallback, useEffect, useState} from 'react';
import {Tooltip} from '../tooltip/Tooltip';

export const UrlLink = (({
  editable,
  name: nameProp,
  url: urlProp,
  formik,
  onClick,
}) => {
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
        : <Tooltip title={url}>
          <Typography
            color="primary"
            style={{cursor: 'pointer'}}
            onClick={onClick}
          >
            {name}
          </Typography>
        </Tooltip>
      }
    </>
  );
});

UrlLink.displayName = 'UrlLink';
