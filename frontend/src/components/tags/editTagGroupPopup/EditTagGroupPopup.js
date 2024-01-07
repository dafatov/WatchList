import * as MuiIcons from '@mui/icons-material';
import {Button, ImageList, InputAdornment, MenuItem, Popover, TextField} from '@mui/material';
import {createElement, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from '../../autocomplete/Autocomplete';
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
  const [isEditIcon, setIsEditIcon] = useState(false);

  const optionsPropSorted = useMemo(() => optionsProp.sort((a, b) => a.name.localeCompare(b.name)), [optionsProp]);

  useEffect(() => {
    setGroup(groupProp);
  }, [groupProp, setGroup]);

  useEffect(() => {
    if (!anchorEl) {
      // eslint-disable-next-line no-console
      console.log('reset');
      setIsEditIcon(false);
    }
  }, [setIsEditIcon, anchorEl]);

  useEffect(() => {
    setOptions(optionsPropSorted.concat(inputValue && !optionsPropSorted.map(optionProp => optionProp.name).includes(inputValue)
      ? {name: inputValue, isPattern: true}
      : []));
  }, [optionsPropSorted, setOptions, inputValue]);

  const getGroupColor = useCallback(() => {
    if (formik?.errors.tags?.[index]?.group.iconName) {
      return 'error';
    }

    return 'primary';
  }, [formik?.errors.tags?.[index]?.group.iconName]);

  const handleGroupChange = useCallback((_, newGroup) => {
    setGroup(newGroup);
    formik.setFieldValue(`tags.${index}.group`, newGroup);
    formik.setFieldTouched(`tags.${index}.group`, true, false);
  }, [setGroup, formik.setFieldValue, formik.setFieldTouched, index]);

  const handleGroupIconChange = useCallback(newIconName => {
    setGroup(group => ({
      ...group,
      iconName: newIconName,
    }));
    formik.setFieldValue(`tags.${index}.group.iconName`, newIconName);
    formik.setFieldTouched(`tags.${index}.group.iconName`, true, false);
    setIsEditIcon(false);
  }, [setGroup, formik.setFieldValue, formik.setFieldTouched, index, setIsEditIcon]);

  const error = useMemo(() => formik?.errors.tags?.[index]?.group.name, [formik?.errors.tags?.[index]?.group.name]);
  const icons = useMemo(() => Object.keys(MuiIcons).filter(iconName => iconName.endsWith('Outlined')).sort(), [MuiIcons]);


  return (
    <>
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
          style={{margin: '12px'}}
          value={group}
          inputValue={inputValue}
          renderInput={params => (
            <TextField
              {...params}
              error={!!error}
              label={error}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    {/* eslint-disable-next-line import/namespace */}
                    {createElement(MuiIcons[group?.iconName ?? 'QuestionMarkOutlined'], {
                      color: getGroupColor(),
                      onClick: () => setIsEditIcon(isEditIcon => !isEditIcon),
                    })}
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
        {isEditIcon
          // TODO: Need virtualization cause long render
          ? <ImageList cols={4}>
            {icons.map(iconName => (
              <ImageList key={iconName}>
                <Button onClick={() => handleGroupIconChange(iconName)} style={{minWidth: 0, padding: 0}}>
                  {/* eslint-disable-next-line import/namespace */}
                  {createElement(MuiIcons[iconName])}
                </Button>
              </ImageList>
            ))}
          </ImageList>
          : <></>}
      </Popover>
    </>
  );
});

EditTagGroupPopup.displayName = 'EditTagGroupPopup';
