import {AttachFileOutlined, FileDownloadOutlined, FileUploadOutlined, ImportExportOutlined} from '@mui/icons-material';
import {memo, useMemo} from 'react';
import {Menu} from '../menu/Menu';
import {Shikimori} from './shikimori/Shikimori';
import {SplitIconButton} from '../splitIconButton/SplitIconButton';
import {Yandex} from './yandex/Yandex';
import classNames from 'classnames';
import {getComponentsFromObject} from '../../utils/component';
import {useStyles} from './importExportControllerStyles';
import {useTranslation} from 'react-i18next';

export const ImportExportController = memo(({
  onImport,
  onShikimoriImport,
  onExport,
  disabled,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();

  const importExports = useMemo(() => ({
    file: <SplitIconButton
      mainIcon={<AttachFileOutlined/>}
      leftIcon={<FileUploadOutlined/>}
      rightIcon={<FileDownloadOutlined/>}
      leftTitle={t('common:action.import')}
      rightTitle={t('common:action.export')}
      onLeftClick={onImport}
      onRightClick={onExport}
    />,
    shikimori: <Shikimori onImport={onShikimoriImport}/>,
    yandex: <Yandex/>,
  }), [onImport, onExport, onShikimoriImport]);

  return (
    <Menu
      disabled={disabled}
      mainIcon={<ImportExportOutlined/>}
      menuRootClassName={classNames(classes.dialRoot, {[classes.dialRootDisabled]: disabled})}
      menuRootHoveredClassName={classes.dialRootHovered}
      menuActionsHoveredClassName={classes.dialActionsHovered}
    >
      {getComponentsFromObject(importExports)}
    </Menu>
  );
});

ImportExportController.displayName = 'ImportExportController';
