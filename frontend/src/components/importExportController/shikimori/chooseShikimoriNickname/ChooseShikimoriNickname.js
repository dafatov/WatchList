import {memo, useCallback,} from 'react';
import {Dialog} from '../../../modal/Dialog';
import {TextField} from '../../../textField/TextField';
import {useSessionStorage} from '../../../../utils/storage';
import {useTranslation} from 'react-i18next';

export const ChooseShikimoriNickname = memo(({
  open,
  setOpen,
  onSubmit,
}) => {
  const {t} = useTranslation();
  const [value, setValue] = useSessionStorage('shikimoriNickname');

  const handleSubmit = useCallback(() => {
    onSubmit(value);
  }, [onSubmit, value]);

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      title={t('web:page.animes.modal.chooseShikimoriNickname.title')}
      submitTitle={t('common:action.apply')}
    >
      <TextField
        editable={true}
        value={value}
        onChange={event => setValue(event.target.value)}
      />
    </Dialog>
  );
});

ChooseShikimoriNickname.displayName = 'ChooseShikimoriNickname';
