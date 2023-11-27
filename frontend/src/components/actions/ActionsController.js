import {memo, useMemo} from 'react';
import {Generate} from './generate/Generate';
import {Menu} from '../menu/Menu';
import {MenuOutlined} from '@mui/icons-material';
import {Randomize} from './randomize/Randomize';
import {SettingsController} from '../settings/SettingsController';
import {Shuffle} from './shuffle/Shuffle';
import {getComponentsFromObject} from '../../utils/component';
import {useLocalStorage} from '../../utils/storage';
import {useStyles} from './actionsControllerStyles';

export const ActionsController = memo(({
  indexes,
  setIndexes,
  setPicked,
  editableId,
  getRenderSize,
}) => {
  const classes = useStyles();
  const [activeAction, setActiveAction] = useLocalStorage('activeAction');

  const actions = useMemo(() => ({
    generate: <Generate
      disabled={!!indexes}
      onStart={() => setActiveAction('generate')}
      onStop={() => setActiveAction(null)}
      getRenderSize={getRenderSize}
    />,
    shuffle: <Shuffle
      indexes={indexes}
      setIndexes={setIndexes}
      setPicked={setPicked}
      editableId={editableId}
      onStart={() => setActiveAction('shuffle')}
      onStop={() => setActiveAction(null)}
    />,
    randomize: <Randomize
      active={activeAction === 'randomize'}
      onStart={() => setActiveAction('randomize')}
      onStop={() => setActiveAction(null)}
    />,
  }), [indexes, setActiveAction, getRenderSize, setIndexes, editableId, activeAction]);

  return (
    <div className={classes.root}>
      {activeAction
        ? <>{actions[activeAction]}</>
        : <Menu
          mainIcon={<MenuOutlined/>}
          menuRootHoveredClassName={classes.dialRootHovered}
          menuActionsHoveredClassName={classes.dialActionsHovered}
        >
          {getComponentsFromObject(actions).sort()}
        </Menu>}
      <SettingsController/>
    </div>
  );
});

ActionsController.displayName = 'ActionsController';
