import * as MuiIcons from '@mui/icons-material';
import {createElement, memo, useCallback} from 'react';
import {Chip} from '@mui/material';
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

  const getIcon = useCallback(tag => (
    <Tooltip
      disableInteractive
      title={tag.group?.name ?? ''}
    >
      {/* eslint-disable-next-line import/namespace */}
      {createElement(MuiIcons[tag.group?.iconName ?? 'QuestionMarkOutlined'])}
    </Tooltip>
  ), [createElement]);

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
              icon={getIcon(tag)}
              label={tag.name}
              onClick={event => onClick?.(event.currentTarget, index)}
              {...getTagProps?.({index})}
            />
          </Tooltip>
        ))}
    </>
  );
});

Tags.displayName = 'Tags';
