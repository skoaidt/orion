import "./admin.scss";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import axios from "axios";
import DataTable from "../DataTable/DataTable";
import UserSearch from "./UserSearch";

const AdminMgmt = () => {
  const [admins, setAdmins] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    n_id: "",
    name: "",
    headquarters: "",
    team: "",
  });
  // const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState([]);

  // Fetch admin data
  const fetchAdmins = async () => {
    try {
      const response = await axios.get("/api/developers/getadmin");
      setAdmins(response.data);
    } catch (error) {
      console.error("Admin 계정을 가져오는 데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle modal open/close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setAdminInfo({ n_id: "", name: "", headquarters: "", team: "" });
    // setSearchQuery("");
    // setSearchResults([]);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setAdminInfo({ ...adminInfo, [e.target.name]: e.target.value });
  };

  // Handle admin registration
  const handleRegisterAdmin = async () => {
    try {
      const response = await axios.post("/api/developers/adminreg", adminInfo, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        alert("Admin 등록 성공!");
        fetchAdmins();
        handleCloseModal();
      } else {
        throw new Error("등록 실패");
      }
    } catch (error) {
      console.error("Admin 등록 실패:", error);
      alert("Admin 등록 중 오류가 발생했습니다.");
    }
  };

  // DataTable columns
  const columns = [
    { field: "n_id", headerName: "사번", width: 150 },
    { field: "name", headerName: "이름", width: 200 },
    { field: "headquarters", headerName: "담당", width: 200 },
    { field: "team", headerName: "팀", width: 200 },
  ];

  return (
    <div className="adminMgmt">
      <div className="gap-40"></div>
      <Container maxWidth="xl">
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item xs>
            <Typography component="h1" variant="h5" className="title">
              <AdminPanelSettingsIcon /> Admin 계정 관리
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
            >
              Admin 등록
            </Button>
          </Grid>
        </Grid>

        {/* DataTable */}
        <div style={{ marginTop: "20px" }}>
          <DataTable
            rows={admins.map((admin, index) => ({
              ...admin,
              id: index, // DataGrid requires an `id` field
            }))}
            columns={columns}
            onRowClick={(params) => {
              console.log("클릭된 데이터:", params.row);
            }}
          />
        </div>

        {/* Register Admin Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Admin 등록</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="사번 (N-ID)"
              fullWidth
              name="n_id"
              value={adminInfo.n_id}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="normal"
              label="이름"
              fullWidth
              name="name"
              value={adminInfo.name}
              onChange={handleInputChange}
              required
            />
            <hr style={{ marginTop: "30px", marginBottom: "30px" }} />
          </DialogContent>

          <UserSearch
            onUserSelect={(user) => {
              setAdminInfo((prev) => ({
                ...prev,
                n_id: user.n_id,
                name: user.name,
              }));
              alert(`${user.name} (${user.n_id}) 구성원이 선택되었습니다.`);
            }}
          />
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              취소
            </Button>
            <Button
              onClick={handleRegisterAdmin}
              variant="contained"
              color="primary"
            >
              등록
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default AdminMgmt;
