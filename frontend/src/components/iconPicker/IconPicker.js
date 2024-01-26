import * as MuiIcons from '@mui/icons-material';
import {InputAdornment, TextField} from '@mui/material';
import {memo, useMemo, useState} from 'react';
import {FixedSizeGrid} from 'react-window';
import {Icon} from '../icon/Icon';
import {IconButton} from '../iconButton/IconButton';
import chunk from 'lodash/chunk';
import {useStyles} from './iconPickerStyles';
import {useTranslation} from 'react-i18next';

const ICONS_COLUMNS_COUNT = 16;
const ICONS_ROWS_COUNT = 12;
const ICON_SIZE = 32;

export const IconPicker = memo(({
  onSubmit,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [filterIcons, setFilterIcons] = useState('');

  const muiIcons = useMemo(() => Object.keys(MuiIcons).filter(iconName => iconName.endsWith('Outlined')), [MuiIcons]);
  const icons = useMemo(() => chunk(
    muiIcons.filter(iconName => iconName.match(filterIcons)).sort(),
    ICONS_COLUMNS_COUNT,
  ), [muiIcons, filterIcons, ICONS_COLUMNS_COUNT]);

  return (
    <>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MuiIcons.SearchOutlined/>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                title={t('common:action.clear')}
                onClick={() => setFilterIcons('')}
              >
                <MuiIcons.ClearOutlined/>
              </IconButton>
            </InputAdornment>
          ),
        }}
        className={classes.textField}
        value={filterIcons}
        onChange={event => setFilterIcons(event.target.value)}
      />
      <FixedSizeGrid
        columnCount={Math.min(ICONS_COLUMNS_COUNT, icons[0]?.length ?? 0)}
        rowCount={icons.length}
        columnWidth={ICON_SIZE}
        rowHeight={ICON_SIZE}
        width={ICON_SIZE * (ICONS_COLUMNS_COUNT + 1)}
        height={ICONS_ROWS_COUNT * ICON_SIZE}
      >
        {({columnIndex, rowIndex, style}) => {
          const iconName = icons[rowIndex][columnIndex];

          if (!iconName) {
            return <></>;
          }

          return (
            <IconButton
              onClick={() => onSubmit(iconName)}
              style={style}
            >
              <Icon title={iconName} iconName={iconName}/>
            </IconButton>
          );
        }}
      </FixedSizeGrid>
    </>
  );
});

IconPicker.displayName = 'IconPicker';
