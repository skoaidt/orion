import React, { useCallback, useEffect, useState } from "react";
import "./admin.scss";
import { Container } from "@mui/system";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import axios from "axios";
import DataTable from "../DataTable/DataTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import moment from "moment";

const ModifySol = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [open, setOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [newSolution, setNewSolution] = useState({
    sol_name: "",
    sol_full_name: "",
    kor_name: "",
    n_id: "",
    url: "",
    github_url: "",
    work_field: "",
    reg_date: "",
    usedYN: "Y", // 기본값
  });
  const [file, setFile] = useState(null);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "sol_name", headerName: "Solution Name", width: 200 },
    { field: "sol_full_name", headerName: "Solution Full Name", width: 200 },
    { field: "kor_name", headerName: "한글 명칭", width: 200 },
    { field: "n_id", headerName: "개발자 사번", width: 120 },
    { field: "name", headerName: "개발자", width: 150 },
    { field: "work_field", headerName: "업무 직군", width: 150 },
    { field: "reg_date", headerName: "개발 일자", width: 150 },
    {
      field: "usedYN",
      headerName: "사용여부",
      width: 120,
      renderCell: (params) => {
        if (params.value === "Y") {
          return <CheckCircleIcon style={{ color: "green" }} />;
        } else if (params.value === "N") {
          return <CancelIcon style={{ color: "tomato" }} />;
        }
        return null;
      },
    },
  ];

  // API 호출 함수
  const fetchSolutions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/solutions/getmodifysol");
      const formattedRows = response.data.map((solution) => ({
        id: solution.id,
        sol_name: solution.sol_name,
        sol_full_name: solution.sol_full_name,
        kor_name: solution.kor_name,
        n_id: solution.n_id,
        name: solution.name,
        work_field: solution.work_field,
        reg_date: solution.reg_date,
        usedYN: solution.usedYN, // 사용 여부 추가
      }));
      // console.log("Fetched solutions:", formattedRows); // 로그 추가
      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolutions();
  }, [fetchSolutions]);

  const handleRowClick = (row) => {
    setSelectedSolution(row);
    setOpenEditModal(true);
  };
  const handleEditClose = () => {
    setOpenEditModal(false);
    setSelectedSolution(null);
  };

  const handleRegisterClose = () => {
    setOpenRegisterModal(false);
    setNewSolution({
      sol_name: "",
      sol_full_name: "",
      kor_name: "",
      n_id: "",
      url: "",
      github_url: "",
      work_field: "",
      reg_date: "",
    });
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("업로드 시도: ", file);
      const res = await axios.post("/api/upload/solutions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("업로드 성공: ", res.data);
      return res.data.filePath; // 서버에서 반환된 웹 접근 가능한 경로
    } catch (err) {
      console.error("업로드 실패: ", err);
      throw new Error("파일 업로드 실패");
    }
  };

  const handleSave = async () => {
    try {
      let imgPath = null;
      if (file) {
        imgPath = await upload();
        console.log("업로드된 파일 경로 : ", imgPath);
      }
      const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const updatedSolution = {
        ...selectedSolution,
        imgUrl: { filePath: imgPath }, // imgUrl.filePath 형태로 수정
        date: currentDateTime,
      };

      console.log("업데이트 요청된 데이터 : ", updatedSolution);

      await axios.put(
        `/api/solutions/updatesoletc/${selectedSolution.id}`,
        updatedSolution
      ); // 수정 API 호출
      fetchSolutions(); // 수정 후 데이터 갱신
      handleEditClose();
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error("Error updating solution:", error);
      alert("수정에 실패했습니다.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let imgPath = null;
      if (file) {
        imgPath = await upload();
        console.log("업로드된 파일 경로 : ", imgPath);
      } else {
        alert("이미지 파일을 선택해주세요.");
        return;
      }

      const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const solutionData = {
        ...newSolution,
        imgUrl: { filePath: imgPath }, // imgUrl.filePath 형태로 수정
        date: currentDateTime,
      };
      console.log("등록 요청된 데이터 : ", solutionData);

      const response = await axios.post(
        "/api/solutions/register",
        solutionData
      );

      if (response.status >= 200 && response.status < 300) {
        alert("Solution 등록 성공!");
        fetchSolutions(); // 등록 후 데이터 새로고침
        handleRegisterClose(); // 등록 모달 닫기
      } else {
        console.error("등록 실패 응답: ", response.data);
        alert("Solution 등록 실패.");
      }
    } catch (error) {
      console.error("Error registering solution:", error);
      alert("Solution 등록 실패.");
    }
  };

  const handleChange = (field, value, isRegister = false) => {
    if (isRegister) {
      setNewSolution((prev) => ({ ...prev, [field]: value }));
    } else {
      setSelectedSolution((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="modifySol">
      <div className="gap-40" />
      <Container component="main" maxWidth="xl">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            className="title"
            style={{ marginBottom: "15px" }}
          >
            <NoteAltIcon /> Solution 관리
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenRegisterModal(true)}
            style={{ backgroundColor: "#565656", width: "120px" }}
          >
            등록하기
          </Button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            pageSize={10}
            onRowClick={handleRowClick}
          />
        )}

        {/* 수정 모달 */}
        <Dialog
          open={openEditModal}
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Solution 수정하기</DialogTitle>
          <DialogContent>
            {selectedSolution && (
              <>
                <TextField
                  margin="normal"
                  label="Solution Name"
                  fullWidth
                  value={selectedSolution.sol_name}
                  onChange={(e) => handleChange("sol_name", e.target.value)}
                />
                <TextField
                  margin="normal"
                  label="Solution Full Name"
                  fullWidth
                  value={selectedSolution.sol_full_name}
                  onChange={(e) =>
                    handleChange("sol_full_name", e.target.value)
                  }
                />
                <TextField
                  margin="normal"
                  label="한글 명칭"
                  fullWidth
                  value={selectedSolution.kor_name}
                  onChange={(e) => handleChange("kor_name", e.target.value)}
                />
                <FormControl component="fieldset" style={{ marginTop: "20px" }}>
                  <FormLabel component="legend">업무 직군</FormLabel>
                  <RadioGroup
                    row
                    name="work_field"
                    value={selectedSolution.work_field}
                    onChange={(e) => handleChange("work_field", e.target.value)}
                  >
                    <FormControlLabel
                      value="rm"
                      control={<Radio />}
                      label="RM"
                    />
                    <FormControlLabel
                      value="access"
                      control={<Radio />}
                      label="Access"
                    />
                    <FormControlLabel
                      value="wire"
                      control={<Radio />}
                      label="전송"
                    />
                    <FormControlLabel
                      value="infra"
                      control={<Radio />}
                      label="Infra설비"
                    />
                    <FormControlLabel
                      value="asset"
                      control={<Radio />}
                      label="자산"
                    />
                    <FormControlLabel
                      value="so"
                      control={<Radio />}
                      label="SO"
                    />
                    <FormControlLabel
                      value="mgmt"
                      control={<Radio />}
                      label="경영"
                    />
                  </RadioGroup>
                </FormControl>

                {/* 사용여부 선택 */}
                <FormControl component="fieldset" style={{ marginTop: "20px" }}>
                  <FormLabel component="legend">사용여부</FormLabel>
                  <RadioGroup
                    row
                    name="usedYN"
                    value={selectedSolution.usedYN}
                    onChange={(e) => handleChange("usedYN", e.target.value)}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label="사용 (Y)"
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label="미사용 (N)"
                    />
                  </RadioGroup>
                </FormControl>
                <Grid item xs={12}>
                  <TextField
                    type="file"
                    fullWidth
                    onChange={handleFileChange}
                  />
                </Grid>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">
              취소
            </Button>
            <Button onClick={handleSave} color="primary">
              저장
            </Button>
          </DialogActions>
        </Dialog>

        {/* 등록 모달 */}
        <Dialog
          open={openRegisterModal}
          onClose={handleRegisterClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Solution 등록하기</DialogTitle>
          <DialogContent>
            <form onSubmit={handleRegister}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Solution Name"
                    required
                    fullWidth
                    value={newSolution.sol_name}
                    onChange={(e) =>
                      handleChange("sol_name", e.target.value, true)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Solution Full Name"
                    fullWidth
                    value={newSolution.sol_full_name}
                    onChange={(e) =>
                      handleChange("sol_full_name", e.target.value, true)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="한글 명칭"
                    fullWidth
                    value={newSolution.kor_name}
                    onChange={(e) =>
                      handleChange("kor_name", e.target.value, true)
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="개발자 사번"
                    required
                    fullWidth
                    value={newSolution.n_id}
                    onChange={(e) => handleChange("n_id", e.target.value, true)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="시스템 바로가기 Link"
                    fullWidth
                    value={newSolution.url}
                    onChange={(e) => handleChange("url", e.target.value, true)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Github 바로가기 Link"
                    fullWidth
                    value={newSolution.github_url}
                    onChange={(e) =>
                      handleChange("github_url", e.target.value, true)
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="개발 일자"
                    fullWidth
                    type="date"
                    id="reg_date"
                    autoComplete="reg_date"
                    value={newSolution.reg_date}
                    onChange={(e) =>
                      handleChange("reg_date", e.target.value, true)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">업무 직군</FormLabel>
                    <RadioGroup
                      row
                      value={newSolution.work_field}
                      onChange={(e) =>
                        handleChange("work_field", e.target.value, true)
                      }
                      sx={{ gap: "4px" }}
                    >
                      <FormControlLabel
                        value="rm"
                        control={<Radio />}
                        label="RM"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="access"
                        control={<Radio />}
                        label="Access"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="wire"
                        control={<Radio />}
                        label="전송"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="infra"
                        control={<Radio />}
                        label="Infra설비"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="asset"
                        control={<Radio />}
                        label="자산"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="so"
                        control={<Radio />}
                        label="SO"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                      <FormControlLabel
                        value="mgmt"
                        control={<Radio />}
                        label="경영"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.7rem",
                          },
                        }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">사용 여부</FormLabel>
                    <RadioGroup
                      row
                      value={newSolution.usedYN}
                      onChange={(e) =>
                        handleChange("usedYN", e.target.value, true)
                      }
                    >
                      <FormControlLabel
                        value="Y"
                        control={<Radio />}
                        label="사용 (Y)"
                      />
                      <FormControlLabel
                        value="N"
                        control={<Radio />}
                        label="미사용 (N)"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    type="file"
                    fullWidth
                    onChange={handleFileChange}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={handleRegisterClose} color="secondary">
                  취소
                </Button>
                <Button type="submit" color="primary">
                  등록
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};

export default ModifySol;
