import {CircularProgress, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {AnimesController} from '../../components/animes/AnimesController';
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
import {useSnackBar} from '../../utils/snackBar';
import {useTranslation} from 'react-i18next';

export const Animes = memo(() => {
  const {t} = useTranslation();
  const {showError, showSuccess} = useSnackBar();
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingAnimes, setIsPendingAnimes] = useState(true);
  const [isPendingDictionaries, setIsPendingDictionaries] = useState(true);
  const [animes, setAnimes] = useState(null);
  const [dictionaries, setDictionaries] = useState(null);
  const [editableId, setEditableId] = useState(null);
  const formik = useFormik({
    initialValues: {
      name: '',
      url: '',
      size: '0',
      status: 'PLANNING',
      episodes: '1',
      supplements: [],
      path: '',
      isPattern: true,
    },
    onSubmit: values => {
      handleSaveAnime(values);
      formik.resetForm();
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
      });
  }, [setAnimes, setIsPendingAnimes]);

  useEffect(() => {
    fetch('http://localhost:8080/api/dictionaries?' + new URLSearchParams({
      volumes: ['statuses', 'supplements'],
    })).then(throwHttpError)
      .then(response => response.json())
      .then(data => {
        setDictionaries(data);
        setIsPendingDictionaries(false);
      });
  }, [setDictionaries, setIsPendingDictionaries]);

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
        showSuccess(t('web:page.animes.table.save.success'));
      }).catch(() => showError(t('web:page.animes.table.save.error')));
  }, [prepareSaveEditable, setAnimes, setEditableId, showSuccess, showError]);

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
    fetch('http://localhost:8080/api/animes/open?' + new URLSearchParams({id}), {
      method: 'POST',
    }).then(throwHttpError)
      .catch(() => showError(t('web:page.animes.table.path.error')));
  }, [showError]);

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

  const getOnRenderSupplementTooltip = useCallback(episodes => supplement => {
    if ((supplement.episodes?.length ?? 0) === 0) {
      return t('common:count.nothing');
    }

    if (supplement.episodes.length === episodes) {
      return t('common:count.all');
    }

    return supplement.episodes.join(', ');
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
        customBodyRenderLite: dataIndex => {
          const {id, name, url} = getFields(dataIndex);

          return (
            <UrlLink
              editable={isEditable(id)}
              name={name}
              url={url}
              onChange={formik.handleChange}
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
              editable={isEditable(id)}
              value={size}
              onChange={formik.handleChange}
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
              onChange={formik.handleChange}
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
      },
    },
    {
      name: 'episodes',
      label: t('web:page:animes.table.episodes.title'),
      options: {
        filter: false,
        searchable: false,
        customBodyRenderLite: dataIndex => {
          const {id, episodes} = getFields(dataIndex);

          return (
            <TextField
              name="episodes"
              editable={isEditable(id)}
              value={episodes}
              onChange={formik.handleChange}
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
              onRenderSupplementTooltip={getOnRenderSupplementTooltip(parseInt(episodes))}
              onRenderSupplementName={getRenderSupplementStatus}
              options={dictionaries?.supplements}
              episodes={parseInt(episodes
                ? episodes
                : '0')}
              setFieldValue={formik.setFieldValue}
              setFieldTouched={formik.setFieldTouched}
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
              editable={isEditable(id)}
              value={path}
              onChange={formik.handleChange}
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
        customBodyRenderLite: dataIndex => {
          const anime = getFields(dataIndex);

          return (
            <AnimesController
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
  ]);

  const options = useMemo(() => ({
    ...defaultOptions,
    sortOrder: {
      name: 'name',
      direction: 'asc',
    },
    customSort: (data, columnIndex, order) => {
      const orderValue = 2 * (order === 'asc') - 1;
      const preparedShowAnimes = prepareShowAnimes();

      return data.sort((a, b) => {
        const getIsPattern = anime => preparedShowAnimes[anime.index].isPattern;

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
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) =>
      <TableFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
        textLabels={textLabels}
        disabled={!!editableId}
        onSubmit={handleAddAnime}
      />,
  }), [editableId, handleAddAnime, prepareShowAnimes]);

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