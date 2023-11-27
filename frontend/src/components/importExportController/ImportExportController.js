import {AttachFileOutlined, FileDownloadOutlined, FileUploadOutlined, ImportExportOutlined} from '@mui/icons-material';
import {memo, useMemo} from 'react';
import {Menu} from '../menu/Menu';
import {Shikimori} from './shikimori/Shikimori';
import {SplitIconButton} from '../splitIconButton/SplitIconButton';
import classNames from 'classnames';
import {getComponentsFromObject} from '../../utils/component';
import {useStyles} from './importExportControllerStyles';

export const ImportExportController = memo(({
  onImport,
  onShikimoriImport,
  onExport,
  disabled,
}) => {
  const classes = useStyles();

  const importExports = useMemo(() => ({
    file: <SplitIconButton
      mainIcon={<AttachFileOutlined/>}
      leftIcon={<FileUploadOutlined/>}
      rightIcon={<FileDownloadOutlined/>}
      onLeftClick={onImport}
      onRightClick={onExport}
    />,
    shikimori: <Shikimori onImport={onShikimoriImport}/>,
  }), [onImport, onExport, onShikimoriImport]);

  return (
    <Menu
      disabled={disabled}
      mainIcon={<ImportExportOutlined/>}
      menuRootClassName={classNames(classes.dialRoot, {[classes.dialRootDisabled]: disabled})}
      menuRootHoveredClassName={classes.dialRootHovered}
      menuActionsHoveredClassName={classes.dialActionsHovered}
    >
      {getComponentsFromObject(importExports).sort()}
    </Menu>
  );
});

ImportExportController.displayName = 'ImportExportController';
