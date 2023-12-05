import {memo, useState} from 'react';
import {IconButton} from '../iconButton/IconButton';
import {useStyles} from './splitIconButtonStyles';

export const SplitIconButton = memo(({
  disabled,
  mainIcon,
  leftIcon,
  rightIcon,
  leftTitle,
  rightTitle,
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
            title={leftTitle}
            disabled={!onLeftClick}
            className={classes.leftButton}
            onClick={() => onLeftClick?.()}
          >
            {leftIcon}
          </IconButton>
          <IconButton
            title={rightTitle}
            disabled={!onRightClick}
            className={classes.rightButton}
            onClick={() => onRightClick?.()}
          >
            {rightIcon}
          </IconButton>
        </div>
        : <IconButton
          className={classes.mainButton}
          disabled={disabled}
          onMouseEnter={() => setIsHovered(true)}
          onClick={() => setIsHovered(true)}
        >
          {mainIcon}
        </IconButton>}
    </>
  );
});

SplitIconButton.displayName = 'SplitIconButton';
