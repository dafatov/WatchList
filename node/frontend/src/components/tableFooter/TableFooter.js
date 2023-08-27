import {AddOutlined, FileDownloadOutlined, FileUploadOutlined, ImportExportOutlined} from '@mui/icons-material';
import {IconButton, MenuItem, TableFooter as MuiTableFooter, Select, TableCell, TableRow} from '@mui/material';
import {memo, useCallback} from 'react';
import MuiTablePagination from '@mui/material/TablePagination';
import {SplitIconButton} from '../splitIconButton/SplitIconButton';

export const TableFooter = memo(({
  count,
  options,
  rowsPerPage,
  page,
  changePage,
  changeRowsPerPage,
  onAdd,
  onUpload,
  onDownload,
  disabled,
}) => {
  const handleAdd = useCallback(event => {
    changePage(Math.ceil(count / rowsPerPage) - 1);
    onAdd(event);
  }, [count, rowsPerPage, changePage, onAdd]);

  const handlePageChange = useCallback(event => {
    changePage(event.target.value);
  }, [changePage]);

  return (
    <MuiTableFooter>
      <TableRow>
        <TableCell colSpan={1000} style={{display: 'grid'}}>
          <div style={{display: 'flex'}}>
            <IconButton
              style={{border: '1px solid', borderRadius: '12px 0 0 12px', flexGrow: 1}}
              color="primary"
              disabled={disabled}
              onClick={handleAdd}
            >
              <AddOutlined/>
            </IconButton>
            <SplitIconButton
              disabled={disabled}
              mainIcon={<ImportExportOutlined/>}
              topIcon={<FileUploadOutlined/>}
              bottomIcon={<FileDownloadOutlined/>}
              onTopClick={onUpload}
              onBottomClick={onDownload}
            />
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'baseline'}}>
            <Select
              value={page}
              onChange={handlePageChange}
              size="small"
              styles={{alignSelf: 'center'}}
            >
              {Array(Math.ceil(count / rowsPerPage)).fill(null)
                .map((_, index) =>
                  <MenuItem key={index} value={index}>
                    {index + 1} ({index * rowsPerPage + 1}-{Math.min(count, (index + 1) * rowsPerPage)})
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
