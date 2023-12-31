import {memo, useCallback} from 'react';
import {Chip} from '@mui/material';
import {Tooltip} from '../../tooltip/Tooltip';

export const Tags = memo(({
  tags,
  formik,
  getTagProps,
}) => {
  const getColor = useCallback((tag, index) => {
    if (formik?.errors.tags?.[index]?.name) {
      return 'error';
    }

    if (tag.isPattern) {
      return 'success';
    }

    return 'primary';
  }, [formik?.errors.tags]);

  return (
    <>
      {tags.sort((a, b) => a.name.localeCompare(b.name))
        .map((tag, index) => (
          <Tooltip
            disableInteractive
            key={tag.id}
            title={formik?.errors.tags?.[index]?.name}
          >
            <Chip
              variant="outlined"
              color={getColor(tag, index)}
              label={tag.name}
              {...getTagProps?.({index})}
            />
          </Tooltip>
        ))}
    </>
  );
});

Tags.displayName = 'Tags';
