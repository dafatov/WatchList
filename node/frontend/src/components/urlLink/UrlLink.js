import {Link as MuiLink, TextField} from '@mui/material';
import {useEffect, useState} from 'react';

export const UrlLink = (({
  editable,
  name: nameProp,
  url: urlProp,
  onBlur,
}) => {
  const [name, setName] = useState(nameProp ?? '');
  const [url, setUrl] = useState(urlProp ?? '');

  useEffect(() => {
    setName(nameProp ?? '');
    setUrl(urlProp ?? '');
  }, [editable, nameProp, urlProp, setName, setUrl]);

  return (
    <>
      {editable
        ? <>
          <TextField
            value={name}
            onBlur={() => onBlur(name, url)}
            onChange={event => setName(event.target.value)}
          />
          <TextField
            value={url}
            onBlur={() => onBlur(name, url)}
            onChange={event => setUrl(event.target.value)}
          />
        </>
        : <MuiLink href={url}>{name}</MuiLink>
      }
    </>
  );
});

UrlLink.displayName = 'UrlLink';
