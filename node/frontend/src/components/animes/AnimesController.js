import {CancelOutlined, DeleteOutline, EditOutlined, Save} from '@mui/icons-material';
import {memo, useCallback, useState} from 'react';
import {ConfirmDeleteAnimeModal} from './confirmDeleteAnimeModal/ConfirmDeleteAnimeModal';
import {IconButton} from '../iconButton/IconButton';
import {useTranslation} from 'react-i18next';

export const AnimesController = memo(({
  editable,
  anime,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}) => {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);

  const handleDelete = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return (
    <>
      {editable
        ? <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IconButton
            title={t('common:action.save')}
            onClick={onSave}
          >
            <Save/>
          </IconButton>
          <IconButton
            title={t('common:action.cancel')}
            onClick={onCancel}
          >
            <CancelOutlined/>
          </IconButton>
        </div>
        : <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IconButton
            title={t('common:action.edit')}
            disabled={!!editable}
            onClick={onEdit}
          >
            <EditOutlined/>
          </IconButton>
          <IconButton
            title={t('common:action.delete')}
            disabled={!!editable}
            onClick={handleDelete}
          >
            <DeleteOutline/>
          </IconButton>
        </div>}
      <ConfirmDeleteAnimeModal
        open={open}
        setOpen={setOpen}
        anime={anime}
        onSubmit={onDelete}
      />
    </>
  );
});

AnimesController.displayName = 'AnimesController';
