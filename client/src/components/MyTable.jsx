import * as React from 'react';
import { useState, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFilter from './TableFilter';
import {useFilter} from '../hooks/useTableData';
import axios from 'axios'
import {TablePaginationActions, getSortedData} from '../utils/table'


export default function MyTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // для выполнения задания беру демонстрационные данные:
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
  
  // когда уже есть БД и бэк- делаем запрос данных оттуда: 
  useEffect(() => {
    axios.get('http://localhost:3001/table')
      .then((results) => {
        if (results.data.length) {
           // console.log(topResults.data);
           setTabledata(results.data)
        }
      })
      .catch(err=>console.log('get request error', err))
  }, [])

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
              <TableCell align="right" onClick={() => getSortedData(tabledata, setTabledata, 'name')}>Название</TableCell>
              <TableCell align="right" onClick={() => getSortedData(tabledata, setTabledata, 'amount')}>Количество</TableCell>
              <TableCell align="right" onClick={() => getSortedData(tabledata, setTabledata, 'distance')}>Расстояние, км</TableCell>
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
