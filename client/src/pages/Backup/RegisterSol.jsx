

import {
  Button, Container, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment";

export const RegisterSol = ({ onSubmit }) => {


  ////////////////////////
  // Solution 불러오기 선언구간
  const [getsolutions, setGetSolutions] = useState([]);

  // 데이터 불러오기 함수
  const fetchSolutions = async () => {
    try {
      const response = await axios.get('/api/solutions/getsolution');
      // ID를 기준으로 오름차순 정렬
      const sortedSolutions = response.data.sort((a, b) => a.id - b.id);
      setGetSolutions(sortedSolutions);
    } catch (error) {
      console.error("solutions 가져올때 오류가 발생하였습니다:", error);
    }
  };
  useEffect(() => {
    fetchSolutions();
  }, []);
  ////////////////////////



  ////////////////////////
  // Solution 등록 선언 구간 
  const [solution, setSolution] = useState({
    sol_name: '',
    sol_full_name: '',
    kor_name: '',
    n_id: '',
    url: '',
    github_url: '',
    work_field: '',
    reg_date: '',
  });
  const [file, setFile] = useState(null);
  const handleChange = (e) => {
    setSolution({ ...solution, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // console.log("업로드 file: ", file);

  // const upload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     console.log("업로드 시도: ", file); // 업로드 시도하는 파일 로그

  //     // FormData의 내용을 로깅
  //     for (let [key, value] of formData.entries()) {
  //       console.log(`${key}: ${value}`);
  //     }

  //     const res = await axios.post("/api/upload", formData);
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file); // 파일 추가
      console.log("업로드 시도: ", file); // 업로드 시도하는 파일 로그

      // FormData의 내용을 로깅
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const res = await axios.post("/api/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // 필요한 경우 명시적으로 세팅
        }
      });
      console.log("업로드 성공: ", res.data); // 응답 로그
      return res.data;
    } catch (err) {
      console.error("업로드 실패: ", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();


    const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const solutionData = { ...solution, imgUrl, date: currentDateTime };
    try {
      const response = await axios.post('/api/solutions/register', solutionData);
      if (response.status >= 200 && response.status < 300) {
        alert('Solution 등록 성공하였습니다.');
        if (typeof onSubmit === 'function') {
          onSubmit(true, solutionData);
        }
      } else {
        alert('Solution 등록 실패하였습니다.');
        if (typeof onSubmit === 'function') {
          onSubmit(false, solutionData);
        }
      }
    }
    catch (error) {
      let errorMessage = '솔루션 등록 실패';
      if (error.response && error.response.status === 409) {
        errorMessage = error.response.data;
      } else {
        errorMessage = `솔루션 등록 실패: ${error.message}`;
      }
      alert(errorMessage);
      console.error('솔루션 등록 중 에러 발생', error);
    }
    setSolution({
      sol_name: '',
      sol_full_name: '',
      kor_name: '',
      n_id: '',
      url: '',
      github_url: '',
      work_field: '',
      reg_date: '',
    });
  };
  ////////////////////////




  return (
    <div className="registerSol">
      <div className="box">
        <div className="bg" />
      </div>
      <div className="gap-60" />

      <Container component="main" maxWidth="xl">
        <Typography component="h1" variant="h5">Solution 등록</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" required fullWidth name="sol_name"
                label="Solution Name" type="text" id="sol_name" autoComplete="sol_name"
                value={solution.sol_name} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" fullWidth name="sol_full_name"
                label="Solution Full Name" type="text" id="sol_full_name" autoComplete="sol_full_name"
                value={solution.sol_full_name} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" fullWidth name="kor_name"
                label="한글 명칭" type="text" id="kor_name" autoComplete="kor_name"
                value={solution.kor_name} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" required fullWidth name="n_id"
                label="개발자 사번" type="text" id="n_id" autoComplete="n_id"
                value={solution.n_id} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" fullWidth name="url"
                label="시스템 바로가기 Link" type="text" id="url" autoComplete="url"
                value={solution.url} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" fullWidth name="github_url"
                label="Github 바로가기 Link" type="text" id="github_url" autoComplete="github_url"
                value={solution.github_url} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" fullWidth name="work_field"
                label="업무 직군" type="text" id="work_field" autoComplete="work_field"
                value={solution.work_field} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" fullWidth name="reg_date"
                label="개발 일자 (YYYY-MM-DD)" type="text" id="reg_date" autoComplete="reg_date"
                value={solution.reg_date} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="outlined" margin="normal" fullWidth name="img"
                type="file" id="img" autoComplete="img" onChange={handleFileChange}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            등록
          </Button>
        </form>
        <div className="gap-60" />
      </Container>

      <Container component="main" maxWidth="xl">
        <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{ mt: 3, mb: 2 }}>
          <Grid item xs>
            <Typography component="h1" variant="h5">
              Solution List
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={fetchSolutions}>
              새로고침
            </Button>
          </Grid>
        </Grid>
        <Paper className="paper">
          <Table className="table">
            <TableHead className="tableHead">
              <TableRow>
                <TableCell className="tableCell">ID</TableCell>
                <TableCell className="tableCell">Solution Name</TableCell>
                <TableCell className="tableCell">Solution Full Name</TableCell>
                <TableCell className="tableCell">한글 명칭</TableCell>
                <TableCell className="tableCell">개발자 사번</TableCell>
                <TableCell className="tableCell">개발자</TableCell>
                <TableCell className="tableCell">담당</TableCell>
                <TableCell className="tableCell">팀</TableCell>
                <TableCell className="tableCell">Link</TableCell>
                <TableCell className="tableCell">Github Link</TableCell>
                <TableCell className="tableCell">업무 직군</TableCell>
                <TableCell className="tableCell">개발 일자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getsolutions.map((sol) => (
                <TableRow key={sol.id}>
                  <TableCell className="tableCell">{sol.id}</TableCell>
                  <TableCell className="tableCell">{sol.sol_name}</TableCell>
                  <TableCell className="tableCell">{sol.sol_full_name}</TableCell>
                  <TableCell className="tableCell">{sol.kor_name}</TableCell>
                  <TableCell className="tableCell">{sol.n_id}</TableCell>
                  <TableCell className="tableCell">{sol.name}</TableCell>
                  <TableCell className="tableCell">{sol.team}</TableCell>
                  <TableCell className="tableCell">{sol.headquarters}</TableCell>
                  <TableCell className="tableCell">{sol.url}</TableCell>
                  <TableCell className="tableCell">{sol.github_url}</TableCell>
                  <TableCell className="tableCell">{sol.work_field}</TableCell>
                  <TableCell className="tableCell">{sol.reg_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      <div className="gap-100"></div>

    </div>
  )
}


export default RegisterSol;
