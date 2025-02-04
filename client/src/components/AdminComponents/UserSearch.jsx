import "./admin.scss";
import { Container, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export const UserSearch = () => {

  /// 구성원 검색 로직 
  const [user, setUser] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchGetuser = async () => {
      try {
        const response = await axios.get("/api/developers/getuser");
        setUser(response.data);
      } catch (error) {
        console.log("구성원 리스트를 가져올때 오류가 발생했습니다.", error);
      };
    };
    fetchGetuser();
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    if (!value.trim()) {
      setSearchResults(user);
      setPage(0);
      return;
    }
    const filteredResults = user.filter(user =>
      user.n_id?.toLowerCase().includes(value) ||
      user.name?.toLowerCase().includes(value) ||
      user.team?.toLowerCase().includes(value) ||
      user.headquarters?.toLowerCase().includes(value)
    );

    setSearchResults(filteredResults);
    setPage(0);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, user.length - page * rowsPerPage);



  return (
    <div className="userSearch">
      <Container main="main" maxWidth="xl">
        <Typography component="h1" variant="h5" className="title" style={{ marginBottom: '20px' }} >
          <PersonSearchIcon />
          구성원 검색
        </Typography>
        <TextField
          fullWidth
          label="검색"
          variant="outlined"
          value={query}
          onChange={handleSearch}
          style={{ marginBottom: '20px' }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead className="tablehead">
              <TableRow>
                <TableCell className="cell">사번</TableCell>
                <TableCell className="cell">성명</TableCell>
                <TableCell className="cell">팀</TableCell>
                <TableCell className="cell">담당</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.n_id}>
                  <TableCell>{user.n_id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>{user.headquarters}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={user.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지 행 수:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to}, 전체 검색 대상: ${count !== -1 ? count : `more than ${to}`}`}
        />
      </Container>

    </div>
  )
}

export default UserSearch;
