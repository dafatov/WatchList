import {Autocomplete, Checkbox, ListItem} from '@mui/material';
import {CheckBoxOutlineBlankOutlined, CheckBoxOutlined} from '@mui/icons-material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Tags} from './tags/Tags';
import {TextField} from '../textField/TextField';
import {useStyles} from './tagsControllerStyles';
import {useTranslation} from 'react-i18next';

export const TagsController = memo(({
  editable,
  tags: tagsProp,
  options: optionsProp,
  formik,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [tags, setTags] = useState(tagsProp);
  const [options, setOptions] = useState(optionsProp);
  const [inputValue, setInputValue] = useState('');

  const optionsPropSorted = useMemo(() => optionsProp.sort((a, b) => a.name.localeCompare(b.name)), [optionsProp]);

  useEffect(() => {
    setTags(tagsProp);
  }, [editable, tagsProp, setTags]);

  useEffect(() => {
    setOptions(optionsPropSorted.concat(inputValue && !optionsPropSorted.map(optionProp => optionProp.name).includes(inputValue)
      ? {name: inputValue, isPattern: true}
      : []));
  }, [editable, optionsPropSorted, setOptions, inputValue]);

  const handleTagsChange = useCallback((_, newTags) => {
    setTags(newTags);
    formik.setFieldValue('tags', newTags);
    formik.setFieldTouched('tags', true, true);
  }, [setTags, formik.setFieldValue, formik.setFieldTouched]);

  return (
    <>
      {editable
        ? <Autocomplete
          multiple
          disableCloseOnSelect
          readOnly={!editable}
          value={tags}
          inputValue={inputValue}
          renderInput={params => (
            <TextField
              editable={editable}
              formik={formik}
              {...params}
            />
          )}
          renderTags={(tags, getTagProps) => (
            <Tags
              tags={tags}
              formik={formik}
              getTagProps={getTagProps}
            />
          )}
          options={options}
          getOptionLabel={option => option.name}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          renderOption={(props, option, {selected}) => (
            <ListItem className={classes.optionRoot} {...props}>
              <Checkbox
                icon={<CheckBoxOutlineBlankOutlined/>}
                checkedIcon={<CheckBoxOutlined/>}
                style={{marginRight: 8}}
                checked={selected}
              />
              {option.name}
            </ListItem>
          )}
          onChange={handleTagsChange}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          clearText={t('common:action.clear')}
          closeText={t('common:action.close')}
          noOptionsText={t('common:result.noOptions')}
          openText={t('common:action.open')}
        />
        : <Tags tags={tags}/>}
    </>
  );
});

TagsController.displayName = 'TagsController';
