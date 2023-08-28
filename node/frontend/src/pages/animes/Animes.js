import * as Yup from 'yup';
import {CircularProgress, Divider, InputAdornment, Typography} from '@mui/material';
import {InfoOutlined, ShuffleOnOutlined, ShuffleOutlined} from '@mui/icons-material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {AnimeController} from '../../components/animes/AnimeController';
import {Generate} from '../../components/generate/Generate';
import {IconButton} from '../../components/iconButton/IconButton';
import MUIDataTable from 'mui-datatables';
import {PathLink} from '../../components/pathLink/PathLink';
import {Select} from '../../components/select/Select';
import {SupplementsController} from '../../components/supplements/SupplementsController';
import {TableFooter} from '../../components/tableFooter/TableFooter';
import {TextField} from '../../components/textField/TextField';
import {UrlLink} from '../../components/urlLink/UrlLink';
import {defaultOptions} from '../../configs/muiDataTableConfig';
import difference from 'lodash/difference';
import {getUnitPrefix} from '../../utils/convert';
import {throwHttpError} from '../../utils/reponse';
import {useFormik} from 'formik';
import {useLocalStorage} from '../../utils/localStorage';
import {useSnackBar} from '../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const Animes = memo(() => {
  const {t} = useTranslation();
  const {showError, showSuccess, showWarning} = useSnackBar();
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingAnimes, setIsPendingAnimes] = useState(true);
  const [isPendingDictionaries, setIsPendingDictionaries] = useState(true);
  const [animes, setAnimes] = useState(null);
  const [dictionaries, setDictionaries] = useState(null);
  const [indexes, setIndexes] = useLocalStorage('sortIndexes');
  const [filterList, setFilterList] = useState(['WATCHING']);
  const [info, setInfo] = useState(null);
  const [editableId, setEditableId] = useState(null);
  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      name: '',
      url: '',
      size: '0',
      status: 'PLANNING',
      multipleViews: '0',
      episodes: '1',
      supplements: [],
      path: '',
      isPattern: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('common:validation.required')),
      url: Yup.string().required(t('common:validation.required'))
        .url(t('common:validation.url')),
      size: Yup.number().required(t('common:validation.required'))
        .positive(t('common:validation.positive')),
      status: Yup.string().required(t('common:validation.required')),
      multipleViews: Yup.number().required(t('common:validation.required'))
        .min(0, t('common:validation.greaterZero'))
        .default(0),
      episodes: Yup.number().required(t('common:validation.required'))
        .positive(t('common:validation.positive')),
      supplements: Yup.array(Yup.object({
        episodes: Yup.array(Yup.number()
          .positive(t('common:validation.positive')),
        ).required(t('common:validation.required'))
          .min(1, t('common:validation.noEmpty')),
        name: Yup.string().required(t('common:validation.required')),
      })),
      path: Yup.string().required(t('common:validation.required')),
    }),
    onSubmit: values => {
      handleSaveAnime(values);
    },
  });

  useEffect(() => {
    setIsLoading(isPendingAnimes || isPendingDictionaries);
  }, [setIsLoading, isPendingAnimes, isPendingDictionaries]);

  useEffect(() => {
    fetch('http://localhost:8080/api/animes')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setAnimes(data);
        setIsPendingAnimes(false);
      }).catch(() => showError(t('web:page.animes.error')));
  }, [setAnimes, setIsPendingAnimes]);

  useEffect(() => {
    fetch('http://localhost:8080/api/dictionaries?' + new URLSearchParams({
      volumes: ['statuses', 'supplements'],
    })).then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setDictionaries(data);
        setIsPendingDictionaries(false);
      }).catch(() => showError(t('web:page.animes.error')));
  }, [setDictionaries, setIsPendingDictionaries]);

  const handleShuffleAnimes = useCallback(() => {
    fetch('http://localhost:8080/api/animes/shuffle')
      .then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setIndexes(data);
        setFilterList(['PLANNING']);
      }).catch(() => showError(t('web:page.animes.shuffle.error')));
  }, [setIndexes]);

  const handleGetInfo = useCallback(() => {
    if (!info) {
      fetch('http://localhost:8080/api/animes/info')
        .then(throwHttpError)
        .then(response => response.json())
        .then(data => {
          setInfo(data);
        }).catch(() => showError(t('web:page.animes.info.error')));
    }
  }, [setInfo, info]);

  const handleUnshuffleAnimes = useCallback(() => {
    setIndexes(null);
    setFilterList(['WATCHING']);
  }, [setIndexes]);

  const handleEpisodesBlur = useCallback(() => {
    formik.setFieldValue('supplements', formik.values.supplements.map(supplement => ({
      ...supplement,
      episodes: supplement.episodes?.filter(episode => episode <= formik.values.episodes),
    })));
  }, [formik.values.episodes, formik.setFieldValue, formik.values.supplements]);

  const prepareSaveEditable = useCallback(anime => ({
    ...anime,
    id: anime.isPattern
      ? null
      : anime.id,
    supplements: anime.supplements.map(supplement => ({
      ...supplement,
      id: supplement.isPattern
        ? null
        : supplement.id,
    })),
  }), []);

  const prepareShowAnimes = useCallback(() => animes.concat(editableId === 'id'
    ? {id: editableId, ...formik.values}
    : []), [animes, formik.values, editableId]);

  const handleEditAnime = useCallback(anime => {
    formik.setValues(anime);
    setEditableId(anime.id);
  }, [setEditableId, formik.setValues]);

  const handleSaveAnime = useCallback(values => {
    fetch('http://localhost:8080/api/animes/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepareSaveEditable(values)),
    }).then(throwHttpError)
      .then(response => response.json())
      .then(animes => {
        setAnimes(animes);
        setEditableId(null);
        setInfo(null);
        formik.resetForm();
        showSuccess(t('web:page.animes.snackBar.table.save.success'));
      }).catch(() => showError(t('web:page.animes.table.save.error')));
  }, [prepareSaveEditable, setAnimes, setEditableId, showSuccess, showError, setInfo, formik.resetForm]);

  const handleCancelAnime = useCallback(() => {
    setEditableId(null);
  }, [setEditableId]);

  const handleDeleteAnime = useCallback(id => {
    fetch('http://localhost:8080/api/animes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([id]),
    }).then(throwHttpError)
      .then(response => response.json())
      .then(animes => {
        setAnimes(animes);
        showSuccess(t('web:page.animes.table.delete.success'));
      }).catch(() => showError(t('web:page.animes.table.delete.error')));
  }, [setAnimes, showSuccess, showError]);

  const handleAddAnime = useCallback(() => {
    setEditableId('id');
    formik.resetForm();
  }, [setEditableId, formik.resetForm]);

  const handleOpenPath = useCallback(id => {
    fetch('http://localhost:8080/api/animes/open/folder?' + new URLSearchParams({id}), {
      method: 'POST',
    }).then(throwHttpError)
      .catch(() => showError(t('web:page.animes.table.path.error')));
  }, [showError]);

  const handleOpenUrl = useCallback(id => {
    fetch('http://localhost:8080/api/animes/open/url?' + new URLSearchParams({id}), {
      method: 'POST',
    }).then(throwHttpError)
      .catch(() => showError(t('web:page.animes.table.url.error')));
  }, [showError]);

  const handleCopyName = useCallback(id => {
    fetch('http://localhost:8080/api/animes/copy/name?' + new URLSearchParams({id}), {
      method: 'POST',
    }).then(throwHttpError)
      .then(response => response.text())
      .then(name => showSuccess(t('common:result.copy', {name})))
      .catch(() => showError(t('web:page.animes.table.name.error')));
  }, [showSuccess, showError]);

  const handleUpload = useCallback(() => {
    const link = document.createElement('input');
    link.type = 'file';
    link.accept = 'application/json';
    link.addEventListener('change', event => new Response(event.target.files[0]).json()
      .then(json => fetch('http://localhost:8080/api/animes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      })).then(response => response.json())
      .then(animes => {
        setAnimes(animes);
        showSuccess(t('web:page.animes.snackBar.export.success'));
      }).catch(() => showError(t('web:page.animes.table.export.error'))));
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([JSON.stringify(animes, null, 2)], {type: 'application/json'}));
    link.setAttribute('download', 'animes.json');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }, [animes]);

  const getRenderStatus = useCallback(status => t(`web:page.animes.table.status.enum.${status}`), []);

  const getRenderSupplementStatus = useCallback(supplementStatus => t(`web:page.animes.table.supplements.enum.${supplementStatus}`), []);

  const getRenderSize = useCallback(size => {
    const {value, prefix} = getUnitPrefix(size);

    return t('common:value', {
      value: value?.toFixed(2) ?? 0,
      unit: t('common:unit.information'),
      prefix: t(`common:unit.prefix.${prefix}`),
    });
  }, []);

  const isEditable = useCallback(id => editableId === id, [editableId]);

  const getFields = useCallback(dataIndex => {
    const anime = prepareShowAnimes()[dataIndex];

    if (isEditable(anime.id)) {
      return {id: anime.id, ...formik.values};
    }

    return anime;
  }, [isEditable, prepareShowAnimes, formik.values]);

  const columns = useMemo(() => [
    {
      name: 'name',
      label: t('web:page.animes.table.name.title'),
      options: {
        filter: false,
        sort: !indexes,
        customHeadLabelRender: column =>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={indexes
              ? {paddingRight: '8px'}
              : {}}>{column.label}</div>
            {indexes
              ? <>
                <Divider flexItem orientation="vertical"/>
                <IconButton
                  title={info
                    ? t('web:page.animes.table.name.info', {info})
                    : <CircularProgress size="24px" color="secondary"/>}
                  onMouseEnter={handleGetInfo}
                >
                  <InfoOutlined/>
                </IconButton>
              </>
              : <></>}
          </div>,
        customBodyRenderLite: dataIndex => {
          const {id, name, url} = getFields(dataIndex);

          return (
            <UrlLink
              editable={isEditable(id)}
              name={name}
              url={url}
              formik={formik}
              onClick={() => handleOpenUrl(id)}
              onCopyName={() => handleCopyName(id)}
            />
          );
        },
      },
    },
    {
      name: 'size',
      label: t('web:page.animes.table.size.title'),
      options: {
        filter: false,
        searchable: false,
        sort: !indexes,
        filterOptions: {
          renderValue: value => getRenderSize(value),
        },
        customFilterListOptions: {
          render: value => getRenderSize(value),
        },
        customBodyRenderLite: dataIndex => {
          const {id, size} = getFields(dataIndex);

          return (
            <TextField
              name="size"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('common:unit.information')}</InputAdornment>,
              }}
              editable={isEditable(id)}
              value={size}
              formik={formik}
              onRender={getRenderSize}
            />
          );
        },
      },
    },
    {
      name: 'status',
      label: t('web:page.animes.table.status.title'),
      options: {
        sort: false,
        searchable: false,
        filter: !indexes,
        filterList,
        filterOptions: {
          names: dictionaries?.statuses,
          renderValue: value => getRenderStatus(value),
        },
        customFilterListOptions: {
          render: value => getRenderStatus(value),
        },
        customBodyRenderLite: dataIndex => {
          const {id, status} = getFields(dataIndex);

          return (
            <Select
              name="status"
              editable={isEditable(id)}
              value={status}
              formik={formik}
              options={dictionaries?.statuses}
              onRender={getRenderStatus}
            />
          );
        },
      },
    },
    {
      name: 'multipleViews',
      label: t('web:page.animes.table.multipleViews.title'),
      options: {
        filter: false,
        searchable: false,
        sort: !indexes,
      },
    },
    {
      name: 'episodes',
      label: t('web:page:animes.table.episodes.title'),
      options: {
        filter: false,
        searchable: false,
        sort: !indexes,
        customBodyRenderLite: dataIndex => {
          const {id, episodes} = getFields(dataIndex);

          return (
            <TextField
              name="episodes"
              type="number"
              editable={isEditable(id)}
              value={episodes}
              onBlur={handleEpisodesBlur}
              formik={formik}
            />
          );
        },
      },
    },
    {
      name: 'supplements',
      label: t('web:page:animes.table.supplements.title'),
      options: {
        sort: false,
        searchable: false,
        filterType: 'multiselect',
        customFilterListOptions: {
          render: value => getRenderSupplementStatus(value),
        },
        filterOptions: {
          names: dictionaries?.supplements,
          logic: (supplements, filters) => difference(filters, supplements.map(supplement => supplement.name)).length !== 0,
          renderValue: value => getRenderSupplementStatus(value),
        },
        customBodyRenderLite: dataIndex => {
          const {id, supplements, episodes} = getFields(dataIndex);

          return (
            <SupplementsController
              editable={isEditable(id)}
              supplements={supplements}
              onRenderSupplementName={getRenderSupplementStatus}
              options={dictionaries?.supplements}
              episodes={parseInt(episodes
                ? episodes
                : '0')}
              formik={formik}
            />
          );
        },
      },
    },
    {
      name: 'path',
      label: t('web:page.animes.table.path.title'),
      options: {
        sort: false,
        searchable: false,
        customBodyRenderLite: dataIndex => {
          const {id, path} = getFields(dataIndex);

          return (
            <PathLink
              name="path"
              editable={isEditable(id)}
              value={path}
              formik={formik}
              onClick={() => handleOpenPath(id)}
            />
          );
        },
      },
    },
    {
      name: '',
      label: '',
      options: {
        sort: false,
        filter: false,
        searchable: false,
        customHeadLabelRender: () => (
          <>
            {indexes
              ? <IconButton
                title={t('common:action.shuffle.off')}
                disabled={!!editableId}
                onClick={() => handleUnshuffleAnimes()}
              >
                <ShuffleOnOutlined/>
              </IconButton>
              : <IconButton
                title={t('common:action.shuffle.on')}
                disabled={!!editableId}
                onClick={() => handleShuffleAnimes()}
              >
                <ShuffleOutlined/>
              </IconButton>}
            <Generate
              disabled={!!indexes}
              getRenderSize={getRenderSize}
            />
          </>
        ),
        customBodyRenderLite: dataIndex => {
          const anime = getFields(dataIndex);

          return (
            <AnimeController
              editable={isEditable(anime.id)}
              anime={anime}
              onSave={formik.handleSubmit}
              onCancel={handleCancelAnime}
              onEdit={() => handleEditAnime(anime)}
              onDelete={handleDeleteAnime}
            />
          );
        },
      },
    },
  ], [
    dictionaries,
    handleEditAnime,
    handleSaveAnime,
    getRenderStatus,
    getRenderSize,
    handleCancelAnime,
    handleDeleteAnime,
    handleOpenPath,
    getRenderSupplementStatus,
    isEditable,
    getFields,
    formik,
    indexes,
    editableId,
    handleShuffleAnimes,
    handleUnshuffleAnimes,
    info,
    handleGetInfo,
    filterList,
  ]);

  const options = useMemo(() => ({
    ...defaultOptions,
    sortOrder: {
      name: 'name',
      direction: 'asc',
    },
    onFilterChange: (columnName, filterLists, _, filterListIndex) => {
      if (columnName === 'status') {
        setFilterList(filterLists[filterListIndex]);
      }
    },
    customSort: (data, columnIndex, order) => {
      const orderValue = 2 * (order === 'asc') - 1;
      const preparedShowAnimes = prepareShowAnimes();

      const getAnime = data => preparedShowAnimes[data.index];
      const getIsPattern = data => getAnime(data).isPattern;
      const getSortIndex = data => {
        const anime = getAnime(data);
        const index = indexes[anime.id];

        if (!index && anime.status === 'PLANNING') {
          showWarning(t('web:page.animes.snackBar.sort.warning.undefined', {anime}));
        }

        return index;
      };

      return data.sort((a, b) => {
        if (indexes) {
          return getSortIndex(a) - getSortIndex(b);
        }

        if (getIsPattern(a) || getIsPattern(b)) {
          return getIsPattern(a) - getIsPattern(b);
        } else {
          const aValue = a.data[columnIndex] ?? '';
          const bValue = b.data[columnIndex] ?? '';

          return orderValue * (typeof aValue?.localeCompare === 'function'
            ? aValue.localeCompare(bValue)
            : aValue - bValue);
        }
      });
    },
    // eslint-disable-next-line max-params
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) =>
      <TableFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
        options={options}
        disabled={!!editableId || !!indexes}
        onAdd={handleAddAnime}
        onUpload={handleUpload}
        onDownload={handleDownload}
      />,
  }), [editableId, handleAddAnime, prepareShowAnimes, indexes, showWarning, setFilterList]);

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (!animes) {
    return <Typography color="primary" variant="body2">{t('common:data.notAvailable')}</Typography>;
  }

  return (
    <MUIDataTable
      columns={columns}
      data={prepareShowAnimes()}
      options={options}
    />
  );
});

Animes.displayName = 'Animes';
