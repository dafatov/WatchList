import {Divider, Typography} from '@mui/material';
import {memo, useRef} from 'react';
import {FileList} from '../fileList/FileList';
import {FileProgress} from './fileProgress/FileProgress';
import {Tooltip} from '../tooltip/Tooltip';
import {useStyles} from './fileProgressTooltipStyles';

export const FileProgressTooltip = memo(({
  children,
  title,
  progress,
  getRenderSize,
}) => {
  const classes = useStyles();
  const tooltipRef = useRef();

  return (
    <Tooltip title={
      <div ref={tooltipRef}>
        <Typography color="secondary" className={classes.action}>{title}</Typography>
        <Divider className={classes.divider} color="secondary" flexItem variant="fullWidth" orientation="horizontal"/>
        <FileProgress
          tooltipTitle={progress.coping}
          anchorEl={tooltipRef.current}
          progressPart={progress.fileProgress}
          speed={progress.speed}
          getRenderSize={getRenderSize}
        />
        <FileProgress
          progressPart={progress.fullProgress}
          speed={progress.speed}
          getRenderSize={getRenderSize}
        />
        <Divider className={classes.divider} color="secondary" flexItem variant="fullWidth" orientation="horizontal"/>
        <FileList
          progress={progress}
          anchorEl={tooltipRef.current}
        />
      </div>
    }>
      <span>
        {children}
      </span>
    </Tooltip>
  );
});

FileProgressTooltip.displayName = 'FileProgressTooltip';
