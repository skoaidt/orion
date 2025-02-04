import "./admin.scss";
import { Button, Container, Grid, TableContainer, TextField, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import UserSearch from './UserSearch';
import ListAltIcon from '@mui/icons-material/ListAlt';
import axios from 'axios';


export const AdminMgmt = () => {

  const [admin, setAdmin] = useState([]);
  const [adminInput, setAdminInput] = useState([]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!adminInput.trim()) return;
    const newUser = {
      n_id: adminInput,
    };

    try {
      const response = await fetch("/api/developers/adminreg", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("서버로 받은 Data: ", data);
        setAdmin((prevUser) => [...prevUser, data]);
        setAdminInput('');
      } else {
        throw new Error("Admin 계정 등록을 실패했습니다.");
      }
    } catch (error) {
      console.error("Admin 계정 등록 에러: ", error);
    }
  };

  const fetchAdmin = async () => {
    try {
      const response = await axios.get("/api/developers/getadmin");
      setAdmin(response.data);
    } catch (error) {
      console.error("Admin 계정을 가져올때 오류가 발생했습니다.", error);
    };
  };
  useEffect(() => {
    fetchAdmin();
  }, []);


  // console.log("user 내용: ", admin);
  return (
    <div className="adminMgmt">
      <div className="gap-20"></div>


      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {/* Admin 계정 등록 섹션 */}
          <Grid item xs={12} md={6}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 3, mb: 2 }}>

              <Typography component="h1" variant="h5" className="title" style={{ marginBottom: '15px' }}>
                <AdminPanelSettingsIcon /> Admin 계정 관리
              </Typography>
            </Grid>
            <form onSubmit={handleAddUser}>
              <TextField
                fullWidth
                variant="outlined"
                label="N사번"
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                style={{ marginBottom: '15px' }}
              />
              <Button variant="contained" color="primary" type="submit">
                Admin 등록
              </Button>
            </form>
          </Grid>

          {/* Admin 계정 리스트 섹션 */}
          <Grid item xs={12} md={6}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 3, mb: 2 }}>
              <Typography component="h1" variant="h5" className="title" style={{ marginBottom: '15px' }}>
                <ListAltIcon /> Admin 계정 리스트
              </Typography>
              <Grid item>
                <Button variant="contained" color="primary" onClick={fetchAdmin}>
                  새로고침
                </Button>
              </Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table>
                <TableHead className="tableHead">
                  <TableRow>
                    <TableCell className="cell">사번</TableCell>
                    <TableCell className="cell">이름</TableCell>
                    <TableCell className="cell">담당</TableCell>
                    <TableCell className="cell">팀</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admin.map((admin, index) => (
                    <TableRow key={admin.n_id || index}>
                      <TableCell>{admin.n_id}</TableCell>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.headquarters}</TableCell>
                      <TableCell>{admin.team}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>

      <div className="gap-60"></div>
      <hr style={{ margin: '0 auto', width: '93%', marginTop: '20px' }} />
      <div className="gap-40"></div>
      <UserSearch />
      <hr style={{ margin: '0 auto', width: '93%', marginTop: '20px' }} />

    </div>
  )
}

export default AdminMgmt;