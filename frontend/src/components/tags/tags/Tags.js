import {memo, useCallback} from 'react';
import {Chip} from '@mui/material';
import {Icon} from '../../icon/Icon';
import {Tooltip} from '../../tooltip/Tooltip';

export const Tags = memo(({
  tags,
  formik,
  onClick,
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

  const getGroupColor = useCallback((tag, index) => {
    if (formik?.errors.tags?.[index]?.group) {
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
            key={tag.name}
            title={formik?.errors.tags?.[index]?.name}
          >
            <Chip
              variant="outlined"
              color={getColor(tag, index)}
              icon={
                <Icon
                  title={tag?.group?.name ?? ''}
                  iconName={tag?.group?.iconName}
                  color={getGroupColor(tag, index)}
                />
              }
              label={tag.name}
              onClick={onClick && (event => onClick(event.currentTarget, index))}
              {...getTagProps?.({index})}
            />
          </Tooltip>
        ))}
    </>
  );
});

Tags.displayName = 'Tags';
