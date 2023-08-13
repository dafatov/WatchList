import {memo, useEffect, useState} from 'react';
import {TextField as MuiTextField} from '@mui/material';

export const TextField = memo(({
  editable,
  type = 'text',
  value: valueProp,
  onRender,
  onBlur,
}) => {
  const [value, setValue] = useState(valueProp ?? '');

  useEffect(() => {
    setValue(valueProp ?? '');
  }, [editable, valueProp, setValue]);

  return (
    <>
      {editable
        ? <MuiTextField
          type={type}
          value={value}
          onBlur={() => onBlur(value)}
          onChange={event => setValue(event.target.value)}
        />
        : onRender?.(value) ?? value}
    </>
  );
});

TextField.displayName = 'TextField';
