import "./productComponents.scss";
import React, { useCallback, useEffect, useState } from 'react'
import DataTable from '../DataTable/DataTable'
import axios from "axios";
import { Button } from '@mui/material';
import Add from "./Add/Add";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";


const ProductPncr = ({ productId, currentUser, goToDetail }) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [developingCount, setDevelopingCount] = useState(0);
  const [droppedCount, setDroppedCount] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'category', headerName: '분류', width: 90 },
    { field: 'title', headerName: '제목', width: 600 },
    { field: 'descrip', headerName: '작성내용', width: 300 },
    { field: 'n_name', headerName: '작성자', width: 100 },
    { field: 'team', headerName: '작성자팀', width: 100 },
    { field: 'date', headerName: '작성일', width: 100 },
    { field: 'viewCount', headerName: '조회수', width: 80 },
    { field: 'complete', headerName: 'Complete', width: 80 },
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/datatables/getpncr?sol_id=${productId}`);
      const dataWithViewCounts = await Promise.all(response.data.map(async (row) => {
        const viewCountResponse = await axios.get(`/api/datatables/pncrCnt?pncr_id=${row.id}`);
        return {
          ...row,
          viewCount: viewCountResponse.data.pncrCnt || 0  // 조회수가 없을 경우 0으로 설정
        };
      }));
      setRows(dataWithViewCounts);

      const total = response.data.length;
      const completed = response.data.filter(row => row.complete === 2).length;
      const developing = response.data.filter(row => row.complete === 1).length;
      const dropped = response.data.filter(row => row.complete === 3).length;
      const completionRate = total ? (completed / total * 100).toFixed(1) : 0;

      setTotalCount(total);
      setCompletedCount(completed);
      setDevelopingCount(developing);
      setDroppedCount(dropped);
      setCompletionRate(completionRate);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  console.log("gotodeatil row : ", rows);
  const handleRowClick = async (row) => {
    try {
      await axios.post('/api/datatables/logPNCRView', {
        pncr_id: row.id,
        n_id: currentUser.userId,
        n_name: currentUser.name,
        team: currentUser.deptName,
        headqt: currentUser.prntDeptName,
        date: format(new Date(), 'yyyy-MM-dd HH:mm'),
      });
      goToDetail(row);
      navigate(`/product/${row.sol_id}/pncrdetail/${row.id}`);
    } catch (error) {
      console.error('조회수 증가 실패', error);
    }
  };


  return (
    <div className='productPNCR'>
      <div className="contentBox">
        <div className="container">

          <div className="gap-60"></div>
          <div className="wrap">
            <div className="titleWrap">
              <div className="title">PN/CR 등록</div>
              <h4>Solution의 오류/버그 및 기능개선 사항을 등록해주시면, 개발 담당자와 소통을 할 수 있습니다. </h4>
              <p>
                등록건수 : {totalCount}건 / 완료: {completedCount}건, 개발중: {developingCount}건, Drop: {droppedCount}건 (완료율 : {completionRate}%)
              </p>
            </div>

            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
              등록하기
            </Button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable columns={columns} rows={rows} onRowClick={handleRowClick} />
          )}
          {open && <Add slug="pncrreg" columns={columns} setOpen={setOpen} productId={productId} fetchData={fetchData} />}
        </div>
        <div className="gap-60"></div>
      </div>

    </div>
  )
}

export default ProductPncr;