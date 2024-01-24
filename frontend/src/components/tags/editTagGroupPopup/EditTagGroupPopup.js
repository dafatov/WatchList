import {Divider, InputAdornment, MenuItem, TextField} from '@mui/material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from '../../autocomplete/Autocomplete';
import {Icon} from '../../icon/Icon';
import {IconButton} from '../../iconButton/IconButton';
import {IconPicker} from '../../iconPicker/IconPicker';
import {Popover} from '../../popover/Popover';
import {useStyles} from './editTagGroupPopupStyles';
import {useTranslation} from 'react-i18next';

export const EditTagGroupPopup = memo(({
  index,
  anchorEl,
  setAnchorEl,
  formik,
  options: optionsProp,
  group: groupProp,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [group, setGroup] = useState(groupProp);
  const [options, setOptions] = useState(optionsProp);
  const [inputValue, setInputValue] = useState('');
  const [isEditIcon, setIsEditIcon] = useState(false);

  const optionsPropSorted = useMemo(() => optionsProp.sort((a, b) => a.name.localeCompare(b.name)), [optionsProp]);
  const error = useMemo(() => formik?.errors.tags?.[index]?.group?.name, [formik?.errors.tags?.[index]?.group?.name]);

  useEffect(() => {
    setGroup(groupProp);
  }, [groupProp, setGroup]);

  useEffect(() => {
    if (!anchorEl) {
      setIsEditIcon(false);
    }
  }, [setIsEditIcon, anchorEl]);

  useEffect(() => {
    setOptions(optionsPropSorted.concat(inputValue && !optionsPropSorted.map(optionProp => optionProp.name).includes(inputValue)
      ? {name: inputValue, isPattern: true}
      : []));
  }, [optionsPropSorted, setOptions, inputValue]);

  const getGroupColor = useCallback(() => {
    if (formik?.errors.tags?.[index]?.group?.iconName) {
      return 'error';
    }

    return 'primary';
  }, [formik?.errors.tags?.[index]?.group?.iconName]);

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

  return (
    <Popover
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
    >
      <Autocomplete
        disabled={isEditIcon}
        classes={{root: classes.autocomplete}}
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
                <InputAdornment position="start" className={classes.inputAdornment}>
                  <IconButton
                    disabled={!group?.name}
                    color={getGroupColor()}
                    onClick={() => setIsEditIcon(isEditIcon => !isEditIcon)}
                    title={isEditIcon
                      ? t('common:action.pickIcon.off')
                      : t('common:action.pickIcon.on')}
                  >
                    <Icon iconName={group?.iconName}/>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, group) => (
          <MenuItem {...props}>
            <Icon iconName={group?.iconName} className={classes.menuItemIcon}/>
            {group.name}
          </MenuItem>
        )}
        options={options}
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        onChange={handleGroupChange}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      />
      {isEditIcon
        ? <>
          <Divider/>
          <IconPicker onSubmit={handleGroupIconChange}/>
        </>
        : <></>}
    </Popover>
  );
});

EditTagGroupPopup.displayName = 'EditTagGroupPopup';
