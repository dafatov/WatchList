import {memo, useMemo, useState} from 'react';
import {LoadingProgress} from '../../loadingProgress/LoadingProgress';
import {Tooltip} from '../../tooltip/Tooltip';
import {Typography} from '@mui/material';
import {useStyles} from './fileProgressStyles';

export const FileProgress = memo(({
  tooltipTitle,
  anchorEl,
  progressPart,
  speed,
  getRenderSize,
}) => {
  const classes = useStyles();
  const [isDetailed, setIsDetailed] = useState(false);

  const progressTitle = useMemo(() => {
    if (isDetailed) {
      return `${getRenderSize(progressPart?.currentSize)}/${getRenderSize(progressPart?.allSize)} (${getRenderSize(speed)}/с)`;
    }

    return `${progressPart?.percent}%`;
  }, [getRenderSize, speed, progressPart, isDetailed]);

  return (
    <Tooltip
      disableInteractive
      title={tooltipTitle}
      PopperProps={{anchorEl}}
    >
      <div
        onMouseEnter={() => setIsDetailed(true)}
        onMouseLeave={() => setIsDetailed(false)}
      >
        <LoadingProgress variant="determinate" value={progressPart?.percent}/>
        <Typography variant="body2" className={classes.progress}>
          {progressTitle}
        </Typography>
      </div>
    </Tooltip>
  );
});

FileProgress.displayName = 'FileProgress';
