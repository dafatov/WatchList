import {IconButton, TextField as MuiTextField} from '@mui/material';
import {memo, useEffect, useState} from 'react';
import {OpenInNew} from '@mui/icons-material';
import {Tooltip} from '../tooltip/Tooltip';

export const PathLink = memo(({
  editable,
  value: valueProp,
  onBlur,
  onClick,
}) => {
  const [value, setValue] = useState(valueProp ?? '');

  useEffect(() => {
    setValue(valueProp ?? '');
  }, [editable, valueProp, setValue]);

  return (
    <>
      {editable
        ? <MuiTextField
          value={value}
          onBlur={() => onBlur(value)}
          onChange={event => setValue(event.target.value)}
        />
        : <Tooltip title={value}>
          <IconButton
            color="primary"
            onClick={() => onClick()}
          >
            <OpenInNew/>
          </IconButton>
        </Tooltip>}
    </>
  );
});

PathLink.displayName = 'PathLink';
