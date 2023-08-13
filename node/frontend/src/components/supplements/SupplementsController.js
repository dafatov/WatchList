import {MenuItem, Select} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {EditSupplementEpisodesModal} from './editSupplementEpisodesModal/EditSupplementEpisodesModal';
import {Supplements} from './supplements/Supplements';

/**
 * @type {React.NamedExoticComponent<{readonly onRenderSupplementTooltip?: Function, readonly onRenderSupplementName?: Function, readonly editable?: boolean,
 *   readonly options?: [string], readonly supplements?: [{id: *, name: string}], readonly editableOptionsCount?: number}>}
 */
export const SupplementsController = memo(({
  editable,
  supplements: supplementsProp,
  onRenderSupplementTooltip,
  onRenderSupplementName,
  options,
  episodes,
  onBlur,
}) => {
  const [supplements, setSupplements] = useState(supplementsProp ?? []);
  const [open, setOpen] = useState(false);
  const [editableSupplementId, setEditableSupplementId] = useState(null);

  useEffect(() => {
    setSupplements(supplementsProp ?? []);
  }, [editable, supplementsProp, setSupplements]);

  const handleEditSupplement = useCallback(id => {
    if (!editable) {
      return;
    }

    setEditableSupplementId(id);
    setOpen(true);
  }, [editable, setOpen, setEditableSupplementId]);

  const handleDeleteSupplement = useCallback(id => {
    setSupplements(supplements => supplements.filter(supplement => supplement.id !== id));
  }, [setSupplements]);

  const handleSubmitModal = useCallback(({supplement, id}) => {
    setSupplements(supplements => [
      ...(supplements.filter(supplement => supplement.id !== id)),
      supplement,
    ]);
  }, [setSupplements]);

  return (
    <>
      {editable
        ? <Select
          multiple
          value={supplements}
          onBlur={() => onBlur(supplements)}
          onChange={event => setSupplements(event.target.value)}
          renderValue={selectedSupplements =>
            <Supplements
              editable={editable}
              supplements={selectedSupplements}
              onRenderSupplementTooltip={onRenderSupplementTooltip}
              onRenderSupplementName={onRenderSupplementName}
              onEdit={handleEditSupplement}
              onDelete={handleDeleteSupplement}
            />}
        >
          {options.sort().map(option =>
            <MenuItem
              key={option}
              value={supplements.find(supplement => supplement.name === option) ?? {
                id: option,
                name: option,
                isPattern: true,
              }}
            >
              {onRenderSupplementName(option)}
            </MenuItem>)}
        </Select>
        : <Supplements
          supplements={supplements}
          onRenderSupplementTooltip={onRenderSupplementTooltip}
          onRenderSupplementName={onRenderSupplementName}
        />}
      <EditSupplementEpisodesModal
        open={open}
        setOpen={setOpen}
        supplements={supplements}
        id={editableSupplementId}
        episodes={episodes}
        onSubmit={handleSubmitModal}
      />
    </>
  );
});

SupplementsController.displayName = 'SupplementsController';
