import * as MuiIcons from '@mui/icons-material';
import {InputAdornment, MenuItem, Popover} from '@mui/material';
import {createElement, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from '../../autocomplete/Autocomplete';
import {TextField} from '../../textField/TextField';
// import {useStyles} from './editTagGroupPopupStyles';
import {useTranslation} from 'react-i18next';

export const EditTagGroupPopup = memo(({
  index,
  anchorEl,
  onClose,
  formik,
  options: optionsProp,
  group: groupProp,
}) => {
  // const classes = useStyles();
  const {t} = useTranslation();
  const [group, setGroup] = useState(groupProp);
  const [options, setOptions] = useState(optionsProp);
  const [inputValue, setInputValue] = useState('');

  const optionsPropSorted = useMemo(() => optionsProp.sort((a, b) => a.name.localeCompare(b.name)), [optionsProp]);

  useEffect(() => {
    setGroup(groupProp);
  }, [groupProp, setGroup]);

  useEffect(() => {
    setOptions(optionsPropSorted.concat(inputValue && !optionsPropSorted.map(optionProp => optionProp.name).includes(inputValue)
      ? {name: inputValue, isPattern: true}
      : []));
  }, [optionsPropSorted, setOptions, inputValue]);

  const handleGroupChange = useCallback((_, newGroup) => {
    setGroup(newGroup);
    formik.setFieldValue(`tags.${index}.group`, newGroup);
    formik.setFieldTouched(`tags.${index}.group`, true, false);
  }, [setGroup, formik.setFieldValue, formik.setFieldTouched, index]);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Autocomplete
        value={group}
        inputValue={inputValue}
        renderInput={params => (
          <TextField
            editable={true}
            formik={formik}
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  {/* eslint-disable-next-line import/namespace */}
                  {createElement(MuiIcons[group?.iconName ?? 'QuestionMarkOutlined'])}
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, group) => (
          <MenuItem {...props}>
            {/* eslint-disable-next-line import/namespace */}
            {createElement(MuiIcons[group?.iconName ?? 'QuestionMarkOutlined'])}
            {group.name}
          </MenuItem>)}
        options={options}
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        onChange={handleGroupChange}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        clearText={t('common:action.clear')}
        closeText={t('common:action.close')}
        noOptionsText={t('common:result.noOptions')}
        openText={t('common:action.open')}
      />
    </Popover>
  );
});

EditTagGroupPopup.displayName = 'EditTagGroupPopup';
