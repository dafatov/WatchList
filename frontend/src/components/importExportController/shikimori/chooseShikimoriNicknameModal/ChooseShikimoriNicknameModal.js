import * as Yup from 'yup';
import {Dialog} from '../../../modal/Dialog';
import {TextField} from '../../../textField/TextField';
import {memo} from 'react';
import {throwHttpError} from '../../../../utils/reponse';
import {useFormik} from 'formik';
import {useSnackBar} from '../../../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const ChooseShikimoriNicknameModal = memo(({
  open,
  setOpen,
  onSubmit,
}) => {
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const formik = useFormik({
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: {
      nickname: '',
    },
    validationSchema: Yup.object({
      nickname: Yup.string().required(t('common:validation.required'))
        .test('exist shikimori nickname', t('common:validation.userNotExist'), nickname =>
          fetch('http://localhost:8080/api/shikimori/user/exist?' + new URLSearchParams({nickname}))
            .then(throwHttpError)
            .then(response => response.json())
            .catch(() => showError(t('web:page.animes.modal.chooseShikimoriNickname.error')))),
    }),
    onSubmit: values => {
      onSubmit(values.nickname);
      setOpen(false);
    }
  });

  return (
    <Dialog
      autoSubmitClose={false}
      open={open}
      setOpen={setOpen}
      onSubmit={formik.handleSubmit}
      title={t('web:page.animes.modal.chooseShikimoriNickname.title')}
      submitTitle={t('common:action.apply')}
    >
      <TextField
        editable
        name="nickname"
        value={formik.values.nickname}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        error={formik.touched.nickname && formik.errors.nickname}
        label={formik.errors.nickname}
      />
    </Dialog>
  );
});

ChooseShikimoriNicknameModal.displayName = 'ChooseShikimoriNicknameModal';
