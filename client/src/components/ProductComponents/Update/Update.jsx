import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Radio, RadioGroup, FormControlLabel, FormControl, TextField, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import "./update.scss";
import { useNavigate } from 'react-router-dom';

const Update = ({ selectedRow, closeModals, fetchData }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(selectedRow.category);
  const [title, setTitle] = useState(selectedRow.title);
  const [descrip, setDescrip] = useState(selectedRow.descrip);

  useEffect(() => {
    if (selectedRow) {
      setCategory(selectedRow.category);
      setTitle(selectedRow.title);
      setDescrip(selectedRow.descrip);
    }
  }, [selectedRow]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/datatables/pncrupdate/${selectedRow.id}`, {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedRow.id,
          category,
          title,
          descrip,
        }),
      });

      if (!response.ok) {
        throw new Error('게시글 수정에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['pncrData'],
      });
      alert(data);
      fetchData();
      navigate(`/product/${selectedRow.sol_id}/pncr`);
    },
    onError: (error) => {
      alert(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!selectedRow) {
    return null;
  }

  return (
    <div className="update">
      <div className="modalContent">
        <IconButton className="close" onClick={closeModals} >
          <CloseIcon />
        </IconButton>
        <div className="titleContainer">
          <EditIcon className="icon" />
          <h1>게시글 수정하기</h1>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="item">
            <FormControl component="fieldset" className="formControl">
              <RadioGroup
                aria-label="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                row
              >
                <FormControlLabel value="PN" control={<Radio />} label="PN (오류/버그)" />
                <FormControlLabel value="CR" control={<Radio />} label="CR (기능개선)" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="item">
            <TextField
              label="제목"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="item">
            <div className="gap-20"></div>
            <label>작성내용</label>
            <div className="editorContainer">
              <ReactQuill value={descrip} onChange={setDescrip} className="editor" />
            </div>
          </div>
          <Button variant="contained" color="primary" type="submit">게시글 수정하기</Button>
        </form>
      </div>
    </div>
  );
}

export default Update;