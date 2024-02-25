import {memo, useCallback, useState} from 'react';
import {IconButton} from '@mui/material';
import classNames from 'classnames';
import {useStyles} from './menuStyles';

export const Menu = memo(({
  children,
  disabled,
  mainIcon,
  menuRootClassName,
  menuRootHoveredClassName,
  menuActionsHoveredClassName,
}) => {
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  const handleHovered = useCallback(isHovered => {
    setIsHovered(isHovered && !disabled);
  }, [setIsHovered, disabled]);

  return (
    <div
      onMouseEnter={() => handleHovered(true)}
      onMouseLeave={() => handleHovered(false)}
      className={classNames(menuRootClassName, {
        [classes.rootHovered]: isHovered,
        [menuRootHoveredClassName]: isHovered,
      })}
    >
      <IconButton disabled={disabled} color="primary">
        {mainIcon}
      </IconButton>
      <div className={classNames(classes.actions, {
        [classes.actionsHovered]: isHovered,
        [menuActionsHoveredClassName]: isHovered,
      })}>
        {children}
      </div>
    </div>
  );
});

Menu.displayName = 'Menu';
