import * as Yup from 'yup';
import {memo, useCallback, useEffect} from 'react';
import {Dialog} from '../../dialog/Dialog';
import {DraggableLists} from '../../draggableLists/DraggableLists';
import {Typography} from '@mui/material';
import classNames from 'classnames';
import {useFormik} from 'formik';
import {useStyles} from './reorderFilesModalStyles';
import {useTranslation} from 'react-i18next';

export const ReorderFilesModal = memo(({
  files,
  open,
  setOpen,
  onSubmit,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const formik = useFormik({
    validateOnMount: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      videos: files,
      voices: [],
      subtitles: [],
    },
    validationSchema: Yup.object({
      videos: Yup.array(Yup.string()
        .required(t('common:validation.required')),
      ).required(t('common:validation.required'))
        .min(1, t('common:validation.noEmpty')),
      voices: Yup.array(Yup.string().nullable())
        .required(t('common:validation.required'))
        .min(1, t('common:validation.noEmpty'))
        .test('isEqualToMax', t('common:validation.equalArrays'), (array, context) =>
          array.length === context.parent.videos?.length),
      subtitles: Yup.array(Yup.string().nullable())
        .required(t('common:validation.required'))
        .min(1, t('common:validation.noEmpty'))
        .test('isEqualToMax', t('common:validation.equalArrays'), (array, context) =>
          array.length === context.parent.videos?.length),
    }),
    onSubmit: values => {
      onSubmit(values);
      setOpen(false);
    },
  });

  useEffect(() => {
    formik.setValues({
      videos: files,
      voices: [],
      subtitles: [],
    });
  }, [files, formik.setValues]);

  const handleChange = useCallback(result => {
    formik.setValues(result, true);
  }, [formik.setValues]);

  return (
    <Dialog
      autoSubmitClose={false}
      open={open}
      setOpen={setOpen}
      onSubmit={formik.handleSubmit}
      title={t('web:page.animes.modal.reorderFiles.title')}
      submitTitle={t('common:action.apply')}
      classes={{paper: classes.dialogPaper, content: classes.dialogContent}}
    >
      <DraggableLists
        lists={formik.values}
        errors={formik.errors}
        onChange={handleChange}
        getListTitle={key => t(`web:page.animes.modal.reorderFiles.list.${key}`)}
      >
        {({data, isDragging}) => (
          <Typography className={classNames(classes.data, {isDragging})}>{data}</Typography>
        )}
      </DraggableLists>
    </Dialog>
  );
});

ReorderFilesModal.displayName = 'ReorderFilesModal';
