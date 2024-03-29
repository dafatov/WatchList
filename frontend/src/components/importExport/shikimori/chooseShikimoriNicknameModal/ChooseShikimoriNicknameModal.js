import * as Yup from 'yup';
import {Avatar, InputAdornment} from '@mui/material';
import {memo, useEffect} from 'react';
import {ClearOutlined} from '@mui/icons-material';
import {Dialog} from '../../../dialog/Dialog';
import {IconButton} from '../../../iconButton/IconButton';
import {TextField} from '../../../textField/TextField';
import {throwHttpError} from '../../../../utils/reponse';
import {useFormik} from 'formik';
import {useSessionStorage} from '../../../../utils/storage';
import {useSnackBar} from '../../../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const ChooseShikimoriNicknameModal = memo(({
  open,
  setOpen,
  onSubmit,
}) => {
  const {t} = useTranslation();
  const {showError} = useSnackBar();
  const [user, setUser] = useSessionStorage('shikimoriUser');
  const formik = useFormik({
    validateOnMount: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      nickname: user?.nickname ?? '',
    },
    validationSchema: Yup.object({
      nickname: Yup.string().required(t('common:validation.required'))
        .test('exist shikimori nickname', t('common:validation.userNotAvailable'), () => user?.isPublic),
    }),
    onSubmit: values => {
      onSubmit(values.nickname);
      setOpen(false);
    },
  });

  useEffect(() => {
    if (formik.values.nickname) {
      fetch('http://localhost:8080/api/shikimori/user?' + new URLSearchParams({nickname: formik.values.nickname}))
        .then(throwHttpError)
        .then(response => response.json())
        .then(user => setUser(user))
        .catch(() => showError(t('web:page.animes.modal.chooseShikimoriNickname.error')))
        .then(() => formik.validateForm());
    } else {
      setUser(null);
      formik.validateForm().then(() => {});
    }
  }, [formik.values.nickname, setUser]);

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
        formik={formik}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Avatar src={user?.avatar}/>
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton
              title={t('common:action.clear')}
              onClick={() => formik.setFieldValue('nickname', '')}
            >
              <ClearOutlined/>
            </IconButton>
          ),
        }}
      />
    </Dialog>
  );
});

ChooseShikimoriNicknameModal.displayName = 'ChooseShikimoriNicknameModal';
