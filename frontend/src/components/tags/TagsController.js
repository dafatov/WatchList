import {Autocomplete, Checkbox, Chip, ListItem} from '@mui/material';
import {CheckBoxOutlineBlankOutlined, CheckBoxOutlined} from '@mui/icons-material';
import {memo, useCallback, useEffect, useState} from 'react';
import {TextField} from '../textField/TextField';
import {useStyles} from './tagsControllerStyles';

export const TagsController = memo(({
  editable,
  tags: tagsProps,
  options,
  formik,
}) => {
  const classes = useStyles();
  const [tags, setTags] = useState(tagsProps);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setTags(tagsProps);
  }, [editable, tagsProps, setTags, formik.values.tags]);

  const getColor = useCallback(index => {
    if (formik?.errors.tags?.[index]?.name) {
      return 'error';
    }

    return 'primary';
  }, [formik?.errors.tags]);

  const handleTagsChange = useCallback((_, newTags) => {
    setTags(newTags);
    // eslint-disable-next-line no-console
    console.log(newTags);
    formik.setFieldValue('tags', newTags);
    formik.setFieldTouched('tags', true, false);
    // eslint-disable-next-line no-console
    console.log(formik);
  }, [setTags, formik.setFieldValue, formik.setFieldTouched]);

  return (
    <>
      <Autocomplete
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
        renderTags={(tags, getTagProps) => {
          return tags.sort((a, b) => a.name.localeCompare(b.name))
            .map((tag, index) => {
              return (
                <Chip
                  key={tag.id}
                  variant="outlined"
                  color={getColor(index)}
                  label={tag.name}
                  {...getTagProps({index})}
                />
              );
            });
        }}
        options={options.sort((a, b) => a.name.localeCompare(b.name)).concat({name: inputValue, isPattern: true})}
        getOptionLabel={option => option.name}
        renderOption={(props, option, {selected}) => (
          <ListItem className={classes.optionRoot} {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankOutlined/>}
              checkedIcon={<CheckBoxOutlined/>}
              style={{marginRight: 8}}
              checked={selected}
            />
            {/*TODO remove when styled*/}
            {option.isPattern
              ? option.name + '*'
              : option.name}
          </ListItem>
        )}
        onChange={handleTagsChange}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      />
    </>
  );
});

TagsController.displayName = 'TagsController';
