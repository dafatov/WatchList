import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {TextField as MuiTextField} from '@mui/material';

export const TextField = memo(({
  editable,
  value: valueProp,
  onRender,
  onBlur,
  formik,
  name,
  type,
  ...props
}) => {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [editable, valueProp, setValue]);

  const error = useMemo(() => {
    return formik.touched[name] && formik.errors[name];
  }, [formik.touched[name], formik.errors[name]]);

  const handleValue = useCallback(event => {
    if (!type || type === 'number' && event.target.value.match(/^$|^0$|^[1-9][0-9]*$/)) {
      setValue(event.target.value);
      formik.handleChange(event);
    }
  }, [setValue, formik.handleChange, type]);

  const handleBlur = useCallback(event => {
    formik.handleBlur(event);
    onBlur?.(event);
  }, [formik.handleBlur, onBlur]);

  return (
    <>
      {editable
        ? <MuiTextField
          name={name}
          value={value}
          onChange={handleValue}
          onBlur={handleBlur}
          error={!!error}
          label={error}
          {...props}
        />
        : onRender?.(value) ?? value}
    </>
  );
});

TextField.displayName = 'TextField';
