import * as React from 'react';
import { useState, useMemo } from 'react'
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableFilter from './TableFilter';
import {useFilter} from '../hooks/useTableData';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tabledata, setTabledata] = useState([
    {date: '2021-01-15', name: 'name1', amount: 3.7, distance: 16.5},
    {date: '2022-05-20', name: 'name2', amount: 356, distance: 17.5},
    {date: '2021-02-15', name: 'name3', amount: 262, distance: 1.5},
    {date: '2021-02-25', name: 'name4', amount: 16.0, distance: 10},
    {date: '2021-09-05', name: 'name5', amount: 17.5, distance: 18.5},
    {date: '2021-10-10', name: 'name6', amount: 345.7, distance: 16.5},
    {date: '2021-12-13', name: 'name7', amount: 245.9, distance: 16.4},
    {date: '2022-01-17', name: 'name8', amount: 3.7, distance: 17.9},
    {date: '2022-02-27', name: 'name9', amount: 3.7, distance: 26.0},
    {date: '2022-06-03', name: 'name10', amount: 3.7, distance: 46.8},
    {date: '2022-04-29', name: 'name11', amount: 3.7, distance: 76.4},
    {date: '2022-03-23', name: 'name12', amount: 3.7, distance: 15.8},
    {date: '2022-02-19', name: 'name13', amount: 3.7, distance: 19.05}
  ])
  const [filter, setFilter] =useState({column: '', condition: '', query: ''})
  const filteredData = useFilter(tabledata, filter.column, filter.condition, filter.query)

  const getSortedData = (column) => {
    let ascCheck = [] // для проверки - все ли элементы массива расположены в порядке возрастания
    for (let i = 0; i < tabledata.length - 1; i += 1) {
      ascCheck.push(tabledata[i + 1][column] >= tabledata[i][column])
    }
    if (ascCheck.includes(false)) { // если НЕ все элементы массива расположены в порядке возрастания
      typeof tabledata[0][column] === 'number'
      ? setTabledata([...tabledata].sort((a, b) => (a[column] - b[column])))
      : setTabledata([...tabledata].sort((a, b) => a[column].localeCompare(b[column])))
    } else {
      typeof tabledata[0][column] === 'number'
      ? setTabledata([...tabledata].sort((a, b) => (b[column] - a[column])))
      : setTabledata([...tabledata].sort((a, b) => b[column].localeCompare(a[column])))
    }
  }
  


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tabledata.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="main-table-div">
      <TableFilter filter={filter} setFilter={setFilter} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell align="right" onClick={() => getSortedData('name')}>Название</TableCell>
              <TableCell align="right" onClick={() => getSortedData('amount')}>Количество</TableCell>
              <TableCell align="right" onClick={() => getSortedData('distance')}>Расстояние, км</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              // ? tabledata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              // : tabledata
              ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredData
            ).map((row) => (
              <TableRow key={row.date}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  {row.amount}
                </TableCell>
                <TableCell align="right">
                  {row.distance}
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={4}
                // count={tabledata.length}
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
