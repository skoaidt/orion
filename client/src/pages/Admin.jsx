import React from 'react';
// import RegisterSol from '../components/AdminComponents/RegisterSol';
import RegisterDev from '../components/AdminComponents/RegisterDev';
import AdminMgmt from '../components/AdminComponents/AdminMgmt';
import { Link, Route, Routes } from 'react-router-dom';
// import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ModifySol from '../components/AdminComponents/ModifySol';


export const Admin = () => {

  return (
    <div className="admin">
      <div className="box">
        <div className="bg" />
      </div>
      <div className="content">
        <div className="menuSection">
          <ul>
            {/* <li><Link to="/controlpanel/" className="menuNm">
              <IntegrationInstructionsIcon />Solution 등록
            </Link></li> */}
            <li><Link to="/controlpanel/modifysol" className="menuNm">
              <NoteAltIcon />Solution 관리
            </Link></li>
            <li><Link to="/controlpanel/registerdev" className="menuNm">
              <AssignmentIndIcon />개발자 등록
            </Link></li>
            <li><Link to="/controlpanel/adminmgmt" className="menuNm">
              <AdminPanelSettingsIcon />Admin 계정 관리
            </Link></li>
          </ul>
        </div>

        <div className="contentSetion">
          <Routes>
            <Route path="/" element={<ModifySol />} />
            <Route path="/registerdev" element={<RegisterDev />} />
            <Route path="/adminmgmt" element={<AdminMgmt />} />
            <Route path="/modifysol" element={<ModifySol />} />
          </Routes>

        </div>


      </div>
    </div>

  )
}


export default Admin;
