import {Chip} from '@mui/material';
import {Tooltip} from '../../tooltip/Tooltip';
import {memo} from 'react';

/**
 * @type {React.NamedExoticComponent<{readonly supplements: [{id: *, name: string}], readonly onEdit?: Function, readonly onRenderSupplementTooltip: Function,
 *   readonly onRenderSupplementName?: Function}>}
 */
export const Supplements = memo(({
  supplements,
  onRenderSupplementTooltip,
  onRenderSupplementName,
  onEdit,
}) => {
  return (
    <>
      {supplements.map((supplement, index) =>
        <Tooltip
          key={supplement.id}
          title={onRenderSupplementTooltip(supplement)}
        >
          <Chip
            variant="outlined"
            color="primary"
            label={onRenderSupplementName?.(supplement.name) ?? supplement.name}
            onClick={() => onEdit?.(index)}
            onMouseDown={event => event.stopPropagation()}
          />
        </Tooltip>,
      )}
    </>
  );
});

Supplements.displayName = 'Supplements';
