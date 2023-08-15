import {Link, TextField} from '@mui/material';
import {useCallback, useEffect, useState} from 'react';

export const UrlLink = (({
  editable,
  name: nameProp,
  url: urlProp,
  onChange,
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
    onChange(event);
  }, [setName, onChange]);

  const handleUrlChange = useCallback(event => {
    setUrl(event.target.value);
    onChange(event);
  }, [setUrl, onChange]);

  return (
    <>
      {editable
        ? <>
          <TextField
            name="name"
            value={name}
            onChange={handleNameChange}
          />
          <TextField
            name="url"
            value={url}
            onChange={handleUrlChange}
          />
        </>
        : <Link target="_blank" href={url}>{name}</Link>
      }
    </>
  );
});

UrlLink.displayName = 'UrlLink';
