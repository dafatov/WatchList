import {memo, useCallback} from 'react';
import {Chip} from '@mui/material';
import {Tooltip} from '../../tooltip/Tooltip';

/**
 * @type {React.NamedExoticComponent<{readonly supplements: [{id: *, name: string}], readonly onEdit?: Function, readonly onRenderSupplementTooltip: Function,
 *   readonly onRenderSupplementName?: Function}>}
 */
export const Supplements = memo(({
  supplements,
  onRenderSupplementTooltip,
  onRenderSupplementName,
  onClick,
  formik,
}) => {
  const getColor = useCallback(index => {
    if (formik?.errors.supplements?.[index]?.episodes) {
      return 'error';
    }

    return 'primary';
  }, [formik?.errors.supplements]);

  return (
    <>
      {supplements.map((supplement, index) =>
        <Tooltip
          key={supplement.id}
          title={onRenderSupplementTooltip(supplement)}
        >
          <Chip
            variant="outlined"
            color={getColor(index)}
            label={onRenderSupplementName?.(supplement.name) ?? supplement.name}
            onClick={() => onClick?.(index)}
            onMouseDown={event => event.stopPropagation()}
          />
        </Tooltip>,
      )}
    </>
  );
});

Supplements.displayName = 'Supplements';
