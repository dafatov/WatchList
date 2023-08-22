import {MenuItem, Select} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {EditSupplementEpisodesModal} from './editSupplementEpisodesModal/EditSupplementEpisodesModal';
import {Supplements} from './supplements/Supplements';
import {pack} from '../../utils/number';
import {useTranslation} from 'react-i18next';

/**
 * @type {React.NamedExoticComponent<{readonly supplements?: [{id: *, name: string}], readonly setFieldTouched?: *, readonly editable?: *, readonly
 *   setFieldValue?: *, readonly onRenderSupplementTooltip?: *, readonly onRenderSupplementName?: *, readonly options?: *, readonly episodes?: *}>}
 */
export const SupplementsController = memo(({
  editable,
  supplements: supplementsProp,
  onRenderSupplementName,
  options,
  episodes,
  formik,
}) => {
  const {t} = useTranslation();
  const [supplements, setSupplements] = useState(supplementsProp);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setSupplements(supplementsProp);
  }, [editable, supplementsProp, setSupplements]);

  const handleChange = useCallback(event => {
    setSupplements(event.target.value);
    formik.setFieldValue('supplements', event.target.value);
    formik.setFieldTouched('supplements', true, false);
  }, [setSupplements, formik.setFieldValue, formik.setFieldTouched]);

  const handleEpisodesSubmit = useCallback(values => {
    formik.setFieldValue(`supplements.${index}.episodes`, values);
    formik.setFieldTouched(`supplements.${index}.episodes`, true, false);
  }, [formik.setFieldValue, formik.setFieldTouched, index]);

  const getSupplementTooltip = useCallback(supplement => {
    if ((supplement.episodes?.length ?? 0) === 0) {
      return t('common:count.nothing');
    }

    if (supplement.episodes.length === episodes) {
      return t('common:count.all');
    }

    return isExpanded
      ? supplement.episodes.join(', ')
      : pack(supplement.episodes);
  }, [pack, episodes, isExpanded]);

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
                onRenderSupplementTooltip={getSupplementTooltip}
                onRenderSupplementName={onRenderSupplementName}
                formik={formik}
                onClick={index => {
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
            initialValues={supplements[index]?.episodes}
          />
        </>
        : <Supplements
          supplements={supplements}
          onRenderSupplementTooltip={getSupplementTooltip}
          onRenderSupplementName={onRenderSupplementName}
          onClick={() => setIsExpanded(isExpanded => !isExpanded)}
        />}
    </>
  );
});

SupplementsController.displayName = 'SupplementsController';
