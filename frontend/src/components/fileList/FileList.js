import {List, ListItem, ListItemText} from '@mui/material';
import {memo, useCallback} from 'react';
import {Scrollbar} from 'react-scrollbars-custom';
import {Tooltip} from '../tooltip/Tooltip';
import {useStyles} from './fileListStyles';

export const FileList = memo(({
  anchorEl,
  progress,
}) => {
  const classes = useStyles();

  const getRenderer = useCallback(className => ({
    renderer: ({children, key, elementRef}) =>
      <div key={key} ref={elementRef} className={className}>{children}</div>,
  }), []);

  return (
    <Scrollbar
      noScrollX
      contentProps={getRenderer(classes.content)}
      wrapperProps={getRenderer(classes.wrapper)}
      scrollerProps={getRenderer(classes.scroller)}
    >
      <List className={classes.list} dense>
        {progress.completed?.files.map((path, index) =>
          <Tooltip
            disableInteractive
            key={index}
            title={`${progress.completed.commonPath}${path}`}
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
