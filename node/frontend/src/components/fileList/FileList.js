import {List, ListItem, ListItemText} from '@mui/material';
import {Scrollbar} from 'react-scrollbars-custom';
import {Tooltip} from '../tooltip/Tooltip';
import {memo} from 'react';
import {useStyles} from './fileListStyles';

export const FileList = memo(({
  anchorEl,
  progress,
}) => {
  const classes = useStyles();

  return (
    <Scrollbar
      noScrollX
      contentProps={{className: classes.completedContent}}
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
            title={`${progress.commonPath}${path}`}
            PopperProps={{anchorEl}}
          >
            <ListItem>
              <ListItemText primary={path}/>
            </ListItem>
          </Tooltip>,
        )}
      </List>
    </Scrollbar>
  );
});

FileList.displayName = 'FileList';
