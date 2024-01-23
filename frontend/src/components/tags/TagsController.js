import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {Autocomplete} from '../autocomplete/Autocomplete';
import {EditTagGroupPopup} from './editTagGroupPopup/EditTagGroupPopup';
import {Icon} from '../icon/Icon';
import {MenuItem} from '@mui/material';
import {Tags} from './tags/Tags';
import {TextField} from '../textField/TextField';
import uniqWith from 'lodash/uniqWith';
import {useStyles} from './tagsControllerStyles';

export const TagsController = memo(({
  editable,
  tags: tagsProp,
  options: optionsProp,
  formik,
}) => {
  const classes = useStyles();
  const [tags, setTags] = useState(tagsProp);
  const [anchorEl, setAnchorEl] = useState(null);
  const [index, setIndex] = useState(null);
  const [options, setOptions] = useState(optionsProp);
  const [inputValue, setInputValue] = useState('');

  const optionsPropSorted = useMemo(() => uniqWith(
    optionsProp.concat(tags).sort((a, b) => a.name.localeCompare(b.name)),
    (a, b) => a?.name === b?.name,
  ), [optionsProp, tags]);
  const groupOptions = useMemo(() => uniqWith(
    options.filter(option => option.group).map(option => option.group),
    (a, b) => a?.name === b?.name,
  ), [options]);

  useEffect(() => {
    setTags(tagsProp);
  }, [editable, tagsProp, setTags]);

  useEffect(() => setOptions(optionsPropSorted
    .concat(inputValue && !optionsPropSorted.map(optionProp => optionProp.name).includes(inputValue)
      ? {name: inputValue, isPattern: true}
      : []),
  ), [editable, optionsPropSorted, setOptions, inputValue]);

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
            classes={{popper: classes.autocomplete}}
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
            renderOption={(props, tag) => (
              <MenuItem {...props}>
                <Icon iconName={tag?.group?.iconName} className={classes.menuItemIcon}/>
                {tag.name}
              </MenuItem>
            )}
            options={options}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            onChange={handleTagsChange}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          />
          <EditTagGroupPopup
            index={index}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            formik={formik}
            options={groupOptions}
            group={tags[index]?.group ?? null}
          />
        </>
        : <Tags tags={tags}/>}
    </>
  );
});

TagsController.displayName = 'TagsController';
