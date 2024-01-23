import * as MuiIcons from '@mui/icons-material';
import {createElement, memo} from 'react';

export const Icon = memo(({
  iconName,
  ...props
}) => (
  // eslint-disable-next-line import/namespace
  createElement(MuiIcons[iconName ?? 'QuestionMarkOutlined'], props)
));

Icon.displayName = 'Icon';
