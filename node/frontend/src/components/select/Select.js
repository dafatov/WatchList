import {MenuItem, TextField} from '@mui/material';
import {memo, useEffect, useState} from 'react';

export const Select = memo(({
  editable,
  value: valueProp,
  onBlur,
  options,
  onRender,
}) => {
  const [value, setValue] = useState(valueProp ?? options?.[0] ?? '');

  useEffect(() => {
    setValue(valueProp ?? options?.[0] ?? '');
  }, [editable, valueProp, setValue]);

  return (
    <>
      {editable
        ? <TextField
          select
          value={value}
          onBlur={() => onBlur(value)}
          onChange={event => setValue(event.target.value)}
        >
          {options.map(option =>
            <MenuItem key={option} value={option}>
              {onRender(option)}
            </MenuItem>,
          )}
        </TextField>
        : onRender(value)}
    </>
  );
});

Select.displayName = 'Select';
