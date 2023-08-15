import {memo, useCallback, useEffect, useState} from 'react';
import {TextField as MuiTextField} from '@mui/material';

export const TextField = memo(({
  editable,
  value: valueProp,
  onRender,
  onChange,
  ...props
}) => {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [editable, valueProp, setValue]);

  const handleValue = useCallback(event => {
    setValue(event.target.value);
    onChange(event);
  }, [setValue, onChange]);

  return (
    <>
      {editable
        ? <MuiTextField
          value={value}
          onChange={handleValue}
          {...props}
        />
        : onRender?.(value) ?? value}
    </>
  );
});

TextField.displayName = 'TextField';
