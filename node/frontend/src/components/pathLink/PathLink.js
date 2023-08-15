import {IconButton, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {OpenInNew} from '@mui/icons-material';
import {Tooltip} from '../tooltip/Tooltip';

export const PathLink = memo(({
  editable,
  value: valueProp,
  onChange,
  onClick,
}) => {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [editable, valueProp, setValue]);

  const handleChange = useCallback(event => {
    setValue(event.target.value);
    onChange(event);
  }, [setValue, onChange]);

  return (
    <>
      {editable
        ? <TextField
          name="path"
          value={value}
          onChange={handleChange}
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
