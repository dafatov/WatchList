import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {memo, useCallback, useEffect, useState} from 'react';
import {DraggableList} from './draggableList/DraggableList';
import {Stack} from '@mui/material';
import cloneDeep from 'lodash/cloneDeep';
import {move} from '../../utils/array';
import {useStyles} from './draggableListsStyles';

export const DraggableLists = memo(({
  children,
  lists: listsProp,
  errors,
  onChange,
  getListTitle,
}) => {
  const classes = useStyles();
  const [lists, setLists] = useState({});

  useEffect(() => {
    setLists(Object.entries(listsProp).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value.map((item, index) => ({id: `${index}-${Date.now().toString()}`, data: item})),
    }), {}));
  }, [setLists]);

  useEffect(() => {
    onChange?.(Object.entries(lists).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value.map(item => item.data),
    }), {}));
  }, [lists]);

  const handleDragEnd = useCallback(({source, destination}) => {
    if (!destination) {
      return;
    }

    setLists(lists => {
      move(lists[source.droppableId], lists[destination.droppableId], source.index, destination.index);
      return cloneDeep(lists);
    });
  }, [setLists]);

  return (
    <Stack direction="row" spacing={1} className={classes.root}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(lists).map(([listName, list]) => (
          <Droppable key={listName} droppableId={listName}>
            {(provided, snapshot) => (
              <DraggableList
                count={Object.keys(lists).length}
                max={Object.values(lists).reduce((acc, list) => Math.max(acc, list.length), 0)}
                errors={errors}
                listName={listName}
                list={list}
                getListTitle={getListTitle}
                provided={provided}
                snapshot={snapshot}
                setLists={setLists}
              >
                {children}
              </DraggableList>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </Stack>
  );
});

DraggableLists.displayName = 'DraggableLists';
