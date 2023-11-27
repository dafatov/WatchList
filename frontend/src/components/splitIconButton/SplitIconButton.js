import {memo, useState} from 'react';
import {IconButton} from '@mui/material';
import {useStyles} from './splitIconButtonStyles';

export const SplitIconButton = memo(({
  disabled,
  mainIcon,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
}) => {
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {isHovered && !disabled
        ? <div
          className={classes.container}
          onMouseLeave={() => setIsHovered(false)}
        >
          <IconButton
            color="primary"
            disabled={!onLeftClick}
            className={classes.leftButton}
            onClick={() => onLeftClick?.()}
          >
            {leftIcon}
          </IconButton>
          <IconButton
            color="primary"
            disabled={!onRightClick}
            className={classes.rightButton}
            onClick={() => onRightClick?.()}
          >
            {rightIcon}
          </IconButton>
        </div>
        : <IconButton
          className={classes.mainButton}
          color="primary"
          disabled={disabled}
          onMouseEnter={() => setIsHovered(true)}
        >
          {mainIcon}
        </IconButton>}
    </>
  );
});

SplitIconButton.displayName = 'SplitIconButton';
