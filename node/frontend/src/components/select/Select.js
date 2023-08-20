import {MenuItem, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';

export const Select = memo(({
  editable,
  value: valueProp,
  formik,
  name,
  options,
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

  return (
    <>
      {editable
        ? <TextField
          name={name}
          select
          value={value}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched[name] && !!formik.errors[name]}
          label={formik.touched[name] && formik.errors[name] && <>{formik.errors[name]}</>}
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
