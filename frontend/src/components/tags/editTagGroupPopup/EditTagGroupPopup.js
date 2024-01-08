import * as MuiIcons from '@mui/icons-material';
import {Divider, InputAdornment, MenuItem, Popover, TextField} from '@mui/material';
import {createElement, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from '../../autocomplete/Autocomplete';
import {FixedSizeGrid} from 'react-window';
import {IconButton} from '../../iconButton/IconButton';
import chunk from 'lodash/chunk';
// import {useStyles} from './editTagGroupPopupStyles';
import {useTranslation} from 'react-i18next';

const ICONS_COLUMNS_COUNT = 16;
const ICONS_ROWS_COUNT = 12;
const ICON_SIZE = 32;

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
  const [filterIcons, setFilterIcons] = useState('');

  const optionsPropSorted = useMemo(() => optionsProp.sort((a, b) => a.name.localeCompare(b.name)), [optionsProp]);
  const icons = useMemo(() => chunk(Object.keys(MuiIcons)
    .filter(iconName => iconName.endsWith('Outlined'))
    .filter(iconName => iconName.match(filterIcons))
    .sort(), ICONS_COLUMNS_COUNT), [MuiIcons, filterIcons, ICONS_COLUMNS_COUNT]);
  const error = useMemo(() => formik?.errors.tags?.[index]?.group.name, [formik?.errors.tags?.[index]?.group.name]);

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

  // eslint-disable-next-line no-console
  console.log({optionsPropSorted, options, optionsProp});
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
          disabled={isEditIcon}
          style={{margin: '16px'}}
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
                    <IconButton
                      disabled={!group?.name}
                      color={getGroupColor()}
                      onClick={() => setIsEditIcon(isEditIcon => !isEditIcon)}
                      title={t('common:action.pickIcon')}
                    >
                      {/* eslint-disable-next-line import/namespace */}
                      {createElement(MuiIcons[group?.iconName ?? 'QuestionMarkOutlined'])}
                    </IconButton>
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
          ? <>
            <Divider/>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MuiIcons.SearchOutlined/>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      title={t('common:action.clear')}
                      onClick={() => setFilterIcons('')}
                    >
                      <MuiIcons.ClearOutlined/>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{display: 'flex', margin: '16px'}}
              value={filterIcons}
              onChange={event => setFilterIcons(event.target.value)}
            />
            <FixedSizeGrid
              columnCount={Math.min(ICONS_COLUMNS_COUNT, icons[0]?.length ?? 0)}
              rowCount={icons.length}
              columnWidth={ICON_SIZE}
              rowHeight={ICON_SIZE}
              width={ICON_SIZE * (ICONS_COLUMNS_COUNT + 1)}
              height={ICONS_ROWS_COUNT * ICON_SIZE}
            >
              {({columnIndex, rowIndex, style}) => {
                const iconName = icons[rowIndex][columnIndex];

                if (!iconName) {
                  return <></>;
                }

                return (
                  <IconButton
                    title={iconName}
                    onClick={() => handleGroupIconChange(iconName)}
                    style={style}
                  >
                    {/* eslint-disable-next-line import/namespace */}
                    {createElement(MuiIcons[iconName])}
                  </IconButton>
                );
              }}
            </FixedSizeGrid>
          </>
          : <></>}
      </Popover>
    </>
  );
});

EditTagGroupPopup.displayName = 'EditTagGroupPopup';
