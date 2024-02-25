import {IconButton, MenuItem, TableFooter as MuiTableFooter, Select, TableCell, TableRow} from '@mui/material';
import {memo, useCallback} from 'react';
import {AddOutlined} from '@mui/icons-material';
import {ImportExportController} from '../importExport/ImportExportController';
import MuiTablePagination from '@mui/material/TablePagination';
import {useStyles} from './tableFooterStyles';

export const TableFooter = memo(({
  count,
  options,
  rowsPerPage,
  page,
  changePage,
  changeRowsPerPage,
  onAdd,
  onImport,
  onShikimoriImport,
  onExport,
  disabled,
}) => {
  const classes = useStyles();

  const handleAdd = useCallback(event => {
    changePage(Math.ceil(count / rowsPerPage) - 1);
    onAdd(event);
  }, [count, rowsPerPage, changePage, onAdd]);

  const handlePageChange = useCallback(event => {
    changePage(event.target.value);
  }, [changePage]);

  const getMenuTitle = useCallback(index => {
    return `${index + 1} (${index * rowsPerPage + 1}-${Math.min(count, (index + 1) * rowsPerPage)})`;
  }, [rowsPerPage, count]);

  return (
    <MuiTableFooter>
      <TableRow>
        <TableCell colSpan={1000} className={classes.tableCell}>
          <div className={classes.actionContainer}>
            <IconButton
              className={classes.addButton}
              color="primary"
              disabled={disabled}
              onClick={handleAdd}
            >
              <AddOutlined/>
            </IconButton>
            <ImportExportController
              onImport={onImport}
              onExport={onExport}
              onShikimoriImport={onShikimoriImport}
              disabled={disabled}
            />
          </div>
          <div className={classes.paginationContainer}>
            <Select
              value={page}
              onChange={handlePageChange}
              size="small"
              className={classes.paginationSelect}
            >
              {Array(Math.ceil(count / rowsPerPage)).fill(null)
                .map((_, index) =>
                  <MenuItem key={index} value={index}>
                    {getMenuTitle(index)}
                  </MenuItem>,
                )}
            </Select>
            <MuiTablePagination
              component="div"
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, page) => changePage(page)}
              rowsPerPageOptions={options.rowsPerPageOptions}
              labelRowsPerPage={options.textLabels.pagination.rowsPerPage}
              labelDisplayedRows={({from, to, count}) =>
                `${from}-${to} ${options.textLabels.pagination.displayRows} ${count}`}
              backIconButtonProps={{
                'aria-label': options.textLabels.pagination.previous,
              }}
              nextIconButtonProps={{
                'aria-label': options.textLabels.pagination.next,
              }}
              onRowsPerPageChange={event => changeRowsPerPage(event.target.value)}
            />
          </div>
        </TableCell>
      </TableRow>
    </MuiTableFooter>
  );
});

TableFooter.displayName = 'TableFooter';
