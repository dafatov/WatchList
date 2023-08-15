import {MenuItem, Select} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {EditSupplementEpisodesModal} from './editSupplementEpisodesModal/EditSupplementEpisodesModal';
import {Supplements} from './supplements/Supplements';

/**
 * @type {React.NamedExoticComponent<{readonly supplements?: [{id: *, name: string}], readonly setFieldTouched?: *, readonly editable?: *, readonly
 *   setFieldValue?: *, readonly onRenderSupplementTooltip?: *, readonly onRenderSupplementName?: *, readonly options?: *, readonly episodes?: *}>}
 */
export const SupplementsController = memo(({
  editable,
  supplements: supplementsProp,
  onRenderSupplementTooltip,
  onRenderSupplementName,
  options,
  episodes,
  setFieldValue,
  setFieldTouched,
}) => {
  const [supplements, setSupplements] = useState(supplementsProp);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    setSupplements(supplementsProp);
  }, [editable, supplementsProp, setSupplements]);

  const handleChange = useCallback(event => {
    setSupplements(event.target.value);
    setFieldValue('supplements', event.target.value);
    setFieldTouched('supplements', true, false);
  }, [setSupplements, setFieldValue, setFieldTouched]);

  const handleEpisodesSubmit = useCallback(values => {
    setFieldValue(`supplements.${index}.episodes`, values);
    setFieldTouched(`supplements.${index}.episodes`, true, false);
  }, [setFieldValue, setFieldTouched, index]);

  return (
    <>
      {editable
        ? <>
          <Select
            name="supplements"
            multiple
            value={supplements}
            onChange={handleChange}
            renderValue={selectedSupplements =>
              <Supplements
                supplements={selectedSupplements}
                onRenderSupplementTooltip={onRenderSupplementTooltip}
                onRenderSupplementName={onRenderSupplementName}
                onEdit={index => {
                  setIndex(index);
                  setOpen(true);
                }}
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
          <EditSupplementEpisodesModal
            open={open}
            setOpen={setOpen}
            onSubmit={handleEpisodesSubmit}
            episodes={episodes}
            initialValues={supplements[index]?.episodes ?? []}
          />
        </>
        : <Supplements
          supplements={supplements}
          onRenderSupplementTooltip={onRenderSupplementTooltip}
          onRenderSupplementName={onRenderSupplementName}
        />}
    </>
  );
});

SupplementsController.displayName = 'SupplementsController';
