import {AddOutlined, FileDownloadOutlined, FileUploadOutlined, ImportExportOutlined} from '@mui/icons-material';
import {IconButton, TableFooter as MuiTableFooter, TableCell, TableRow} from '@mui/material';
import MuiTablePagination from '@mui/material/TablePagination';
import {SplitIconButton} from '../splitIconButton/SplitIconButton';
import {memo} from 'react';

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
}) => (
  <MuiTableFooter>
    <TableRow>
      <TableCell colSpan={1000} style={{display: 'grid'}}>
        <div style={{display: 'flex'}}>
          <IconButton
            style={{border: '1px solid', borderRadius: '12px 0 0 12px', flexGrow: 1}}
            color="primary"
            disabled={disabled}
            onClick={onAdd}
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
      </TableCell>
    </TableRow>
  </MuiTableFooter>
));

TableFooter.displayName = 'TableFooter';
