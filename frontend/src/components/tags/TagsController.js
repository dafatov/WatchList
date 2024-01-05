import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from '../autocomplete/Autocomplete';
import {EditTagGroupPopup} from './editTagGroupPopup/EditTagGroupPopup';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [index, setIndex] = useState(null);
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
        ? <>
          <Autocomplete
            multiple
            disableCloseOnSelect
            readOnly={!editable}
            value={tags}
            inputValue={inputValue}
            className={classes.autocomplete}
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
                onClick={(currentTarget, index) => {
                  setIndex(index);
                  setAnchorEl(currentTarget);
                }}
                getTagProps={getTagProps}
              />
            )}
            options={options}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onChange={handleTagsChange}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            clearText={t('common:action.clear')}
            closeText={t('common:action.close')}
            noOptionsText={t('common:result.noOptions')}
            openText={t('common:action.open')}
          />
          <EditTagGroupPopup
            index={index}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            formik={formik}
            options={[{name: 'name1'}, {name: 'name2'}, {name: 'group', iconName: 'FemaleOutlined'}]}
            group={tags[index]?.group}
          />
        </>
        : <Tags tags={tags}/>}
    </>
  );
});

TagsController.displayName = 'TagsController';
