import {MenuItem, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';

export const Select = memo(({
  editable,
  value: valueProp,
  onChange,
  options,
  onRender,
  ...props
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
          select
          value={value}
          onChange={handleChange}
          {...props}
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
