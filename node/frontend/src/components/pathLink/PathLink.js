import {IconButton, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {OpenInNew} from '@mui/icons-material';
import {Tooltip} from '../tooltip/Tooltip';

export const PathLink = memo(({
  editable,
  value: valueProp,
  formik,
  name,
  onClick
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
          value={value}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched[name] && !!formik.errors[name]}
          label={formik.touched[name] && formik.errors[name] && <>{formik.errors[name]}</>}
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
