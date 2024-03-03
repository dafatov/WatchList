import * as Yup from 'yup';
import {TextField, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useState} from 'react';
import {Dialog} from '../../dialog/Dialog';
import {DraggableLists} from '../../draggableLists/DraggableLists';
import {EditOutlined} from '@mui/icons-material';
import {IconButton} from '../../iconButton/IconButton';
import {Popover} from '../../popover/Popover';
import classNames from 'classnames';
import last from 'lodash/last';
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
  const [editableRow, setEditableRow] = useState(null);
  const formik = useFormik({
    validateOnMount: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      postfixes: [],
      files: {
        videos: files.files,
        voices: [],
        subtitles: [],
      },
    },
    validationSchema: Yup.object({
      postfixes: Yup.array(Yup.string()
        .required(t('common:validation.required')),
      ).required(t('common:validation.required'))
        .min(1, t('common:validation.noEmpty'))
        .test('isEqualToMax', t('common:validation.equalArrays'), (array, context) =>
          array.length === context.parent.files.videos?.length),
      files: Yup.object({
        videos: Yup.array(Yup.string()
          .required(t('common:validation.required')
            .trim()),
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
    }),
    onSubmit: values => {
      onSubmit(values);
      setOpen(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue('files', {
      videos: files.files,
      voices: [],
      subtitles: [],
    }, true);
  }, [files.files, formik.setFieldValue]);

  useEffect(() => {
    const mapFile = (_, index) => String(index + 1).padStart(Math.max(2, String(formik.values.files.videos.length).length), '0');

    formik.setFieldValue('postfixes', formik.values.files.videos?.map(mapFile), true);
  }, [formik.values.files.videos, formik.setFieldValue]);

  const handleChange = useCallback(result => {
    formik.setFieldValue('files', result, true);
  }, [formik.setFieldValue]);

  const getPostfixValue = useCallback(index => formik.values.postfixes?.[index] ?? '', [formik.values.postfixes]);
  const getPostfixError = useCallback(index => formik.errors.postfixes?.[index], [formik.errors.postfixes]);
  const getPostfixColor = useCallback(index => {
    if (getPostfixError(index)) {
      return 'error';
    }

    return 'primary';
  }, [getPostfixError]);

  return (
    <Dialog
      autoSubmitClose={false}
      open={open}
      setOpen={setOpen}
      onSubmit={formik.handleSubmit}
      title={t('web:page.animes.modal.reorderFiles.title', {title: last(files.commonPath?.split('\\'))})}
      submitTitle={t('common:action.apply')}
      classes={{paper: classes.dialogPaper, content: classes.dialogContent}}
    >
      <DraggableLists
        lists={formik.values.files}
        errors={formik.errors.files}
        onChange={handleChange}
        getListTitle={key => t(`web:page.animes.modal.reorderFiles.list.${key}`)}
      >
        {({data, isDragging, listName, index, isUsingPlaceholder}) => (
          <>
            {listName === 'videos' && !isDragging && !isUsingPlaceholder
              ? <IconButton
                title={getPostfixError(index) || getPostfixValue(index)}
                color={getPostfixColor(index)}
                className={classes.editPostfixButton}
                onClick={event => setEditableRow({anchorEl: event.currentTarget, index})}
              >
                <EditOutlined/>
              </IconButton>
              : <></>}
            <Typography className={classNames(classes.data, {isDragging})}>{data}</Typography>
          </>
        )}
      </DraggableLists>
      <Popover
        anchorEl={editableRow?.anchorEl}
        setAnchorEl={setEditableRow}
      >
        <div className={classes.editPostfixRoot}>
          <TextField
            error={getPostfixError(editableRow?.index)}
            label={getPostfixError(editableRow?.index) || t('web:page.animes.modal.editPostfix.label')}
            value={getPostfixValue(editableRow?.index)}
            onChange={e => formik.setFieldValue(`postfixes.${editableRow?.index}`, e.target.value, true)}
          />
        </div>
      </Popover>
    </Dialog>
  );
});

ReorderFilesModal.displayName = 'ReorderFilesModal';
