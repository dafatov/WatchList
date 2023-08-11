import {AddOutlined, CancelOutlined, DeleteOutline, EditOutlined, OpenInNew, Save} from '@mui/icons-material';
import {Chip, CircularProgress, IconButton, Link, MenuItem, TextField, Typography} from '@mui/material';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ConfirmDeleteAnimeModal} from './confirmDeleteAnimeModal/ConfirmDeleteAnimeModal';
import {EditSupplementEpisodesModal} from './editSupplementEpisodesModal/EditSupplementEpisodesModal';
import MUIDataTable from 'mui-datatables';
import {TableFooter} from '../../components/tableFooter/TableFooter';
import {Tooltip} from '../../components/tooltip/Tooltip';
import {defaultOptions} from '../../configs/muiDataTableConfig';
import difference from 'lodash/difference';
import {getUnitPrefix} from '../../utils/convert';
import {throwHttpError} from '../../utils/reponse';
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
  const [editable, setEditable] = useState(null);
  const [deletable, setDeletable] = useState(null);
  const [openSupplementEpisodesModal, setOpenSupplementEpisodesModal] = useState(false);
  const [openConfirmDeleteAnimeModal, setOpenConfirmDeleteAnimeModal] = useState(false);
  const [editableSupplementId, setEditableSupplementId] = useState(null);
  const [editableSupplementName, setEditableSupplementName] = useState('');

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

  const prepareSaveEditable = useCallback(() => {
    return {
      ...editable,
      id: editable.isPattern
        ? null
        : editable.id,
      supplements: editable.supplements.map(supplement => supplement.isPattern
        ? {...supplement, id: null}
        : supplement),
    };
  }, [editable]);

  const prepareShowAnimes = useCallback(() => animes.concat(editable?.isPattern
    ? editable
    : []), [animes, editable]);

  const handleEditAnime = useCallback(anime => {
    setEditable(anime);
  }, [setEditable]);

  const handleSaveAnime = useCallback(() => {
    fetch('http://localhost:8080/api/animes/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepareSaveEditable()),
    }).then(throwHttpError)
      .then(response => response.json())
      .then(animes => {
        setAnimes(animes);
        setEditable(null);
        showSuccess(t('web:page.animes.table.save.success'));
      }).catch(() => showError(t('web:page.animes.table.save.error')));
  }, [editable, setEditable, prepareSaveEditable, setAnimes, setEditable, showSuccess, showError]);

  const handleCancelAnime = useCallback(() => {
    setEditable(null);
  }, [setEditable]);

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
  }, [editable, setAnimes, setEditable, showSuccess, showError]);

  const handleAddAnime = useCallback(() => {
    setEditable({
      id: '',
      multipleViews: 0,
      isPattern: true,
      supplements: [],
    });
  }, [setEditable]);

  const handleOpenPath = useCallback(id => {
    fetch('http://localhost:8080/api/animes/open?' + new URLSearchParams({id}), {
      method: 'POST',
    }).then(throwHttpError)
      .catch(() => showError(t('web:page.animes.table.path.error')));
  }, [showError]);

  const handleChangeEditable = useCallback(fieldName => event => {
    setEditable({
      ...editable,
      [fieldName]: event.target.value,
    });
  }, [editable, setEditable]);

  const handleDeleteSupplement = useCallback(id => {
    setEditable({
      ...editable,
      supplements: editable.supplements.filter(supplement => supplement.id !== id),
    });
  }, [editable, setEditable]);

  const handleAddSupplement = useCallback(() => {
    if (!dictionaries.supplements.includes(editableSupplementName) || editable.supplements.find(supplement => supplement.name === editableSupplementName)) {
      return;
    }

    setEditable({
      ...editable,
      supplements: [
        ...editable.supplements, {
          id: editableSupplementName,
          name: editableSupplementName,
          episodes: [],
          isPattern: true,
        },
      ],
    });
  }, [editable, setEditable, editableSupplementName, dictionaries?.supplements]);

  const handleSupplementEpisodesModal = useCallback((supplement, id) => {
    setEditable({
      ...editable,
      supplements: [
        ...(editable.supplements.filter(supplement => supplement.id !== id)),
        supplement,
      ],
    });
  }, [editable, setEditable]);

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

  const columns = useMemo(() => [
    {
      name: 'name',
      label: t('web:page.animes.table.name.title'),
      options: {
        filter: false,
        customBodyRenderLite: dataIndex => {
          const {id, name, url} = prepareShowAnimes()[dataIndex];

          return (
            <>
              {editable?.id === id
                ? <>
                  <TextField
                    value={editable.name ?? ''}
                    onChange={handleChangeEditable('name')}
                  />
                  <TextField
                    value={editable.url ?? ''}
                    onChange={handleChangeEditable('url')}
                  />
                </>
                : <Link href={url}>{name}</Link>
              }
            </>
          );
        },
      },
    }, {
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
          const {id, size} = prepareShowAnimes()[dataIndex];

          return (
            <>
              {editable?.id === id
                ? <TextField
                  value={editable.size ?? ''}
                  onChange={handleChangeEditable('size')}
                />
                : getRenderSize(size)}
            </>
          );
        },
      },
    }, {
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
          const {id, status} = prepareShowAnimes()[dataIndex];

          return (
            <>
              {editable?.id === id
                ? <TextField
                  select
                  value={editable.status ?? ''}
                  onChange={handleChangeEditable('status')}
                >
                  {dictionaries?.statuses.map(option => (
                    <MenuItem key={option} value={option}>
                      {getRenderStatus(option)}
                    </MenuItem>
                  ))}
                </TextField>
                : getRenderStatus(status)}
            </>
          );
        },
      },
    }, {
      name: 'multipleViews',
      label: t('web:page.animes.table.multipleViews.title'),
      options: {
        filter: false,
        searchable: false,
      },
    }, {
      name: 'episodes',
      label: t('web:page:animes.table.episodes.title'),
      options: {
        filter: false,
        searchable: false,
        customBodyRenderLite: dataIndex => {
          const {id, episodes} = prepareShowAnimes()[dataIndex];

          return (
            <>
              {editable?.id === id
                ? <TextField
                  value={editable.episodes ?? ''}
                  onChange={handleChangeEditable('episodes')}
                />
                : episodes}
            </>
          );
        },
      },
    }, {
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
          const {id, supplements, episodes} = prepareShowAnimes()[dataIndex];

          return (
            <>
              {(editable?.id === id
                ? editable.supplements
                : supplements).map(supplement =>
                <Tooltip
                  key={supplement.id}
                  title={supplement.episodes.length === episodes
                    ? t('common:count.all')
                    : supplement.episodes.length === 0
                      ? t('common:count.nothing')
                      : supplement.episodes.join(', ')}
                >
                  <Chip
                    variant="outlined"
                    color="primary"
                    label={t(`web:page.animes.table.supplements.enum.${supplement.name}`)}
                    onClick={() => {
                      if (editable?.id !== id) {
                        return;
                      }

                      setEditableSupplementId(supplement.id);
                      setOpenSupplementEpisodesModal(true);
                    }}
                    onDelete={() => handleDeleteSupplement(supplement.id)}
                    deleteIcon={editable?.id === id
                      ? <DeleteOutline/>
                      : <></>}
                  />
                </Tooltip>,
              )}
              {editable?.id === id
                ? <Chip
                  variant="outlined"
                  color="primary"
                  label={
                    <TextField
                      select
                      value={editableSupplementName ?? ''}
                      onChange={e => setEditableSupplementName(e.target.value)}
                    >
                      {dictionaries?.supplements.map(option => (
                        <MenuItem
                          key={option}
                          value={option}
                          disabled={!!editable.supplements.find(supplement => supplement.name === option)}
                        >
                          {getRenderSupplementStatus(option)}
                        </MenuItem>
                      ))}
                    </TextField>
                  }
                  onDelete={() => handleAddSupplement()}
                  deleteIcon={<AddOutlined/>}
                />
                : <></>}
            </>
          );
        },
      },
    }, {
      name: 'path',
      label: t('web:page.animes.table.path.title'),
      options: {
        sort: false,
        searchable: false,
        customBodyRenderLite: dataIndex => {
          const {id, path} = prepareShowAnimes()[dataIndex];

          return (
            <>
              {editable?.id === id
                ? <TextField
                  value={editable.path ?? ''}
                  onChange={handleChangeEditable('path')}
                />
                : <Tooltip title={path ?? '-'}>
                  <span>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenPath(id)}
                    >
                      <OpenInNew/>
                    </IconButton>
                  </span>
                </Tooltip>}
            </>
          );
        },
      },
    }, {
      name: '',
      label: '',
      options: {
        sort: false,
        filter: false,
        searchable: false,
        customBodyRenderLite: dataIndex => {
          const anime = prepareShowAnimes()[dataIndex];

          return (
            <>
              {editable?.id === anime.id
                ? <>
                  <Tooltip title={t('common:action.save')}>
                    <span>
                      <IconButton
                        color="primary"
                        onClick={handleSaveAnime}
                      >
                        <Save/>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={t('common:action.cancel')}>
                    <span>
                      <IconButton
                        color="primary"
                        onClick={handleCancelAnime}
                      >
                        <CancelOutlined/>
                      </IconButton>
                    </span>
                  </Tooltip>
                </>
                : <>
                  <Tooltip title={t('common:action.edit')}>
                    <span>
                      <IconButton
                        color="primary"
                        disabled={!!editable}
                        onClick={() => handleEditAnime(anime)}
                      >
                        <EditOutlined/>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={t('common:action.delete')}>
                    <span>
                      <IconButton
                        color="primary"
                        disabled={!!editable}
                        onClick={() => {
                          setDeletable(anime);
                          setOpenConfirmDeleteAnimeModal(true);
                        }}
                      >
                        <DeleteOutline/>
                      </IconButton>
                    </span>
                  </Tooltip>
                </>}
            </>
          );
        },
      },
    }, {
      name: 'isPattern',
      label: '',
      options: {
        sort: false,
        filter: false,
        searchable: false,
        display: 'excluded',
      },
    },
  ], [
    dictionaries,
    editable,
    handleEditAnime,
    handleSaveAnime,
    handleChangeEditable,
    handleDeleteSupplement,
    getRenderStatus,
    getRenderSize,
    setOpenSupplementEpisodesModal,
    setEditableSupplementId,
    editableSupplementName,
    setEditableSupplementName,
    handleAddSupplement,
    handleCancelAnime,
    handleDeleteAnime,
    handleOpenPath,
    setDeletable,
    setOpenConfirmDeleteAnimeModal,
    prepareShowAnimes,
  ]);

  const options = useMemo(() => ({
    ...defaultOptions,
    sortOrder: {
      name: 'name',
      direction: 'asc',
    },
    customSort: (data, columnIndex, order) => {
      const orderValue = 2 * (order === 'asc') - 1;

      return data.sort((a, b) => {
        const preparedShowAnimes = prepareShowAnimes();
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
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
      return (
        <TableFooter
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          textLabels={textLabels}
          disabled={!!editable}
          onSubmit={handleAddAnime}
        />
      );
    },
  }), [editable, handleAddAnime, prepareShowAnimes]);

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (!animes) {
    return <Typography color="primary" variant="body2">{t('common:data.notAvailable')}</Typography>;
  }

  return (
    <>
      <MUIDataTable
        columns={columns}
        data={prepareShowAnimes()}
        options={options}
      />
      <EditSupplementEpisodesModal
        open={openSupplementEpisodesModal}
        setOpen={setOpenSupplementEpisodesModal}
        supplements={editable?.supplements}
        id={editableSupplementId}
        episodes={editable?.episodes}
        onSubmit={handleSupplementEpisodesModal}
      />
      <ConfirmDeleteAnimeModal
        open={openConfirmDeleteAnimeModal}
        setOpen={setOpenConfirmDeleteAnimeModal}
        anime={deletable}
        onSubmit={handleDeleteAnime}
      />
    </>
  );
});

Animes.displayName = 'Animes';
