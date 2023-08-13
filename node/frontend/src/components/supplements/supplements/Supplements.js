import {Chip} from '@mui/material';
import {DeleteOutline} from '@mui/icons-material';
import {Tooltip} from '../../tooltip/Tooltip';
import {memo} from 'react';

/**
 * @type {React.NamedExoticComponent<{readonly supplements?: [{id: *, name: string}], readonly onDelete?: Function, readonly editable?: boolean, readonly
 *   onRenderSupplementTooltip?: Function, readonly onRenderSupplementName?: Function, readonly onEdit?: Function}>}
 */
export const Supplements = memo(({
  editable = false,
  supplements,
  onRenderSupplementTooltip,
  onRenderSupplementName,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      {supplements
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(supplement =>
          <Tooltip
            key={supplement.id}
            title={onRenderSupplementTooltip(supplement)}
          >
            <Chip
              variant="outlined"
              color="primary"
              label={onRenderSupplementName?.(supplement.name)}
              onClick={() => onEdit?.(supplement.id)}
              onMouseDown={event => event.stopPropagation()}
              onDelete={() => onDelete?.(supplement.id)}
              deleteIcon={editable
                ? <DeleteOutline/>
                : <></>}
            />
          </Tooltip>,
        )}
    </>
  );
});

Supplements.displayName = 'Supplements';
