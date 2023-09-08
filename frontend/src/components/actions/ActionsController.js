import {memo, useMemo, useState} from 'react';
import {Generate} from './generate/Generate';
import {MenuOutlined} from '@mui/icons-material';
import {IconButton as MuiIconButton} from '@mui/material';
import {SettingsController} from '../settings/SettingsController';
import {Shuffle} from './shuffle/Shuffle';
import classNames from 'classnames';
import {useLocalStorage} from '../../utils/localStorage';
import {useStyles} from './actionsControllerStyles';

export const ActionsController = memo(({
  indexes,
  setIndexes,
  setPicked,
  editableId,
  getRenderSize,
}) => {
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false);
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
  }), [indexes, setActiveAction, getRenderSize, setIndexes, editableId]);

  return (
    <div className={classes.root}>
      {activeAction
        ? <>{actions[activeAction]}</>
        : <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classNames({[classes.dialRoot]: isHovered})}
        >
          <MuiIconButton color="primary">
            <MenuOutlined/>
          </MuiIconButton>
          <div className={classNames(classes.dialActions, {[classes.dialActionsHovered]: isHovered})}>
            {Object.values(actions).sort()}
          </div>
        </div>}
      <SettingsController/>
    </div>
  );
});

ActionsController.displayName = 'ActionsController';
