import {Divider, Typography} from '@mui/material';
import {memo, useMemo, useRef, useState} from 'react';
import {FileList} from '../fileList/FileList';
import {LoadingProgress} from '../loadingProgress/LoadingProgress';
import {Tooltip} from '../tooltip/Tooltip';
import {useStyles} from './fileProgressTooltipStyles';

export const FileProgressTooltip = memo(({
  children,
  title,
  progress,
  getRenderSize,
}) => {
  const classes = useStyles();
  const [isDetailed, setIsDetailed] = useState(false);
  const tooltipRef = useRef();

  const progressTitle = useMemo(() => {
    if (isDetailed) {
      return `${getRenderSize(progress.currentSize)}/${getRenderSize(progress.allSize)} (${getRenderSize(progress.speed)}/с)`;
    }

    return `${progress.percent}%`;
  }, [isDetailed, getRenderSize, progress.currentSize, progress.allSize, progress.percent]);

  return (
    <Tooltip title={
      <div ref={tooltipRef}>
        <Typography color="secondary" className={classes.action}>{title}</Typography>
        <Divider className={classes.divider} color="secondary" flexItem variant="fullWidth" orientation="horizontal"/>
        <div
          onMouseEnter={() => setIsDetailed(true)}
          onMouseLeave={() => setIsDetailed(false)}
        >
          <LoadingProgress variant="determinate" value={progress.percent}/>
          <Typography variant="body2" className={classes.progress}>
            {progressTitle}
          </Typography>
        </div>
        <Divider className={classes.divider} color="secondary" flexItem variant="fullWidth" orientation="horizontal"/>
        <FileList
          progress={progress}
          anchorEl={tooltipRef.current}
        />
      </div>
    }>
      {children}
    </Tooltip>
  );
});

FileProgressTooltip.displayName = 'FileProgressTooltip';
