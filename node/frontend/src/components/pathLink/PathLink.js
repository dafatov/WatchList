import {IconButton, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
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

  const error = useMemo(() => {
    return formik.touched[name] && formik.errors[name];
  }, [formik.touched[name], formik.errors[name]]);

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
          error={!!error}
          label={error}
        />
        : <Tooltip title={value}>
          <IconButton
            color="primary"
            disabled={!value}
            onClick={() => onClick()}
          >
            <OpenInNew/>
          </IconButton>
        </Tooltip>}
    </>
  );
});

PathLink.displayName = 'PathLink';
