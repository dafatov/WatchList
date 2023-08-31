import {memo, useState} from 'react';
import {IconButton} from '@mui/material';
import {useStyles} from './splitIconButtonStyles';

export const SplitIconButton = memo(({
  disabled,
  mainIcon,
  topIcon,
  bottomIcon,
  onTopClick,
  onBottomClick,
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
            className={classes.topButton}
            onClick={() => onTopClick?.()}
          >
            {topIcon}
          </IconButton>
          <IconButton
            color="primary"
            className={classes.bottomButton}
            onClick={() => onBottomClick?.()}
          >
            {bottomIcon}
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
