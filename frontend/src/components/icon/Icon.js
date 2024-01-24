import * as MuiIcons from '@mui/icons-material';
import {createElement, memo} from 'react';
import {Tooltip} from '../tooltip/Tooltip';

export const Icon = memo(({
  title,
  iconName,
  ...props
}) => (
  <Tooltip
    disableInteractive
    title={title}
  >
    {/* eslint-disable-next-line import/namespace */}
    {createElement(MuiIcons[iconName ?? 'QuestionMarkOutlined'], props)}
  </Tooltip>
));

Icon.displayName = 'Icon';
