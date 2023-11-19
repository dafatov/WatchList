import {memo, useCallback} from 'react';
import {Chip} from '@mui/material';
import {Tooltip} from '../../tooltip/Tooltip';

export const Tags = memo(({
  tags,
  formik,
  getTagProps,
}) => {
  const getColor = useCallback(index => {
    if (formik?.errors.tags?.[index]?.name) {
      return 'error';
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
              color={getColor(index)}
              label={tag.name}
              {...getTagProps?.({index})}
            />
          </Tooltip>
        ))}
    </>
  );
});

Tags.displayName = 'Tags';
