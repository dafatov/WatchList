import {IconButton, TableFooter as MuiTableFooter, TableCell, TableRow} from '@mui/material';
import {AddOutlined} from '@mui/icons-material';
import MuiTablePagination from '@mui/material/TablePagination';
import {memo} from 'react';

export const TableFooter = memo(({
  count,
  textLabels,
  rowsPerPage,
  page,
  changePage,
  changeRowsPerPage,
  onSubmit,
  disabled,
}) => {
  return (
    <MuiTableFooter>
      <TableRow>
        <TableCell colSpan={1000} style={{display: 'grid'}}>
          <IconButton
            style={{border: '1px solid', borderRadius: '12px'}}
            color="primary"
            disabled={disabled}
            onClick={onSubmit}
          >
            <AddOutlined/>
          </IconButton>
          <MuiTablePagination
            component="div"
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, page) => changePage(page)}
            labelRowsPerPage={textLabels.rowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
            backIconButtonProps={{
              'aria-label': textLabels.previous,
            }}
            nextIconButtonProps={{
              'aria-label': textLabels.next,
            }}
            onRowsPerPageChange={event => changeRowsPerPage(event.target.value)}
          />
        </TableCell>
      </TableRow>
    </MuiTableFooter>
  );
});

TableFooter.displayName = 'TableFooter';
