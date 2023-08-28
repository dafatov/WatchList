import {Divider, List, ListItem, ListItemText, Typography} from '@mui/material';
import {memo, useRef, useState} from 'react';
import {LoadingProgress} from '../loadingProgress/LoadingProgress';
import {Scrollbar} from 'react-scrollbars-custom';
import {Tooltip} from '../tooltip/Tooltip';

export const FileProgressTooltip = memo(({
  children,
  title,
  progress,
  getRenderSize,
}) => {
  const [isDetailed, setIsDetailed] = useState(false);
  const tooltipRef = useRef();

  return (
    <Tooltip title={
      <div ref={tooltipRef}>
        <Typography color="secondary" style={{padding: 4, textAlign: 'center'}}>{title}</Typography>
        <Divider style={{marginBottom: 8}} color="secondary" flexItem variant="fullWidth" orientation="horizontal"/>
        <div
          onMouseEnter={() => setIsDetailed(true)}
          onMouseLeave={() => setIsDetailed(false)}
        >
          <LoadingProgress variant="determinate" value={progress.percent}/>
          <Typography variant="body2" style={{textAlign: 'center', paddingTop: 0}}>
            {isDetailed
              ? `${getRenderSize(progress.currentSize)}/${getRenderSize(progress.allSize)}`
              : `${progress.percent}%`}
          </Typography>
        </div>
        <Divider style={{marginBottom: 8}} color="secondary" flexItem variant="fullWidth" orientation="horizontal"/>
        <Scrollbar
          noScrollX
          contentProps={{style: {maxHeight: '500px', maxWidth: '300px'}}}
          wrapperProps={{
            renderer: ({elementRef, ...restProps}) =>
              <div {...restProps} ref={elementRef} style={{...restProps.style, position: 'inherit'}}/>,
          }}
          scrollerProps={{style: {position: 'inherit'}}}
        >
          <List dense>
            {progress.completed?.map((path, index) =>
              <Tooltip
                disableInteractive
                key={index}
                title={`${progress.commonPath}\\${path}`}
                PopperProps={{
                  anchorEl: tooltipRef.current,
                }}
              >
                <ListItem>
                  <ListItemText primary={`\\${path}`}/>
                </ListItem>
              </Tooltip>,
            )}
          </List>
        </Scrollbar>
      </div>
    }>
      {children}
    </Tooltip>
  );
});

FileProgressTooltip.displayName = 'FileProgressTooltip';
