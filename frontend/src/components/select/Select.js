import {MenuItem, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';

export const Select = memo(({
  editable,
  value: valueProp,
  formik,
  name,
  options,
  onBlur,
  onRender,
}) => {
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    setValue(valueProp);
  }, [editable, valueProp, setValue]);

  const handleChange = useCallback(event => {
    setValue(event.target.value);
    formik.handleChange(event);
  }, [setValue, formik.handleChange]);

  const handleBlur = useCallback(event => {
    formik.handleBlur(event);
    onBlur?.();
  }, [formik.handleBlur, onBlur]);

  const error = useMemo(() => {
    return formik.touched[name] && formik.errors[name];
  }, [formik.touched[name], formik.errors[name]]);

  return (
    <>
      {editable
        ? <TextField
          name={name}
          select
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!error}
          label={error}
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
