import {AddOutlined, RemoveOutlined} from '@mui/icons-material';
import {Button, Paper, Stack, Typography} from '@mui/material';
import {memo, useCallback} from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {Tooltip} from '../../tooltip/Tooltip';
import classNames from 'classnames';
import {useLongClick} from '../../../utils/useLongClick';
import {useStyles} from './draggableListStyles';

export const DraggableList = memo(({
  children,
  count,
  max,
  errors,
  listName,
  list,
  getListTitle,
  provided,
  snapshot: snapshotProp,
  setLists,
}) => {
  const classes = useStyles({count});

  const handleAddFiller = useCallback((listName, count) => () => {
    setLists(lists => ({
      ...lists,
      [listName]: [
        ...lists[listName],
        ...Array(count).fill(null)
          .map((_, index) => ({id: `${index}-${Date.now().toString()}`, data: null})),
      ],
    }));
  }, [setLists]);

  const handleRemoveFiller = useCallback((listName, element) => () => {
    setLists(lists => ({
      ...lists,
      [listName]: lists[listName].filter(item => item.id !== element.id),
    }));
  }, [setLists]);

  return (
    <Paper className={classes.listRoot}>
      <Tooltip title={errors?.[listName]}>
        <Typography color="primary" className={classNames(classes.listTitle, {
          [classes.listTitleError]: errors?.[listName],
        })}>
          {getListTitle?.(listName) ?? listName}
        </Typography>
      </Tooltip>
      <Stack
        ref={provided.innerRef}
        spacing={1}
        className={classNames(classes.list, {
          [classes.listDraggingOver]: snapshotProp.isDraggingOver,
        })}
        {...provided.droppableProps}
      >
        {list.map((element, index) => (
          <Draggable
            key={element.id}
            draggableId={element.id}
            index={index}
          >
            {(provided, snapshot) => (
              <Paper
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={classNames(classes.element)}
                style={provided.draggableProps.style}
              >
                {element.data
                  ? children({
                    data: element.data,
                    isDragging: snapshot.isDragging,
                    listName,
                    index,
                    isUsingPlaceholder: snapshotProp.isUsingPlaceholder,
                  })
                  : <Button
                    fullWidth
                    variant="contained"
                    className={classes.removeButton}
                    onClick={handleRemoveFiller(listName, element)}
                  >
                    <RemoveOutlined/>
                  </Button>}
              </Paper>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </Stack>
      <Button
        fullWidth
        variant="contained"
        disabled={max - list.length <= 0}
        className={classes.addButton}
        {...useLongClick(
          handleAddFiller(listName, max - list.length),
          handleAddFiller(listName, Math.min(1, max - list.length)),
          500,
        )}
      >
        <AddOutlined/>
      </Button>
    </Paper>
  );
});

DraggableList.displayName = 'DraggableList';
