import React, { useState, useContext, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AuthContext } from "../../../context/authContext";
import { Radio, RadioGroup, FormControlLabel, FormControl, TextField, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import "./add.scss";
import { format } from 'date-fns';

const Add = ({ slug, columns, setOpen, productId, fetchData }) => {
  const { currentUser } = useContext(AuthContext);

  const [category, setCategory] = useState('PN');
  const [title, setTitle] = useState('');
  const [descrip, setDescrip] = useState('');

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/datatables/${slug}`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sol_id: productId,
          category,
          title,
          descrip,
          date: format(new Date(), 'yyyy-MM-dd HH:mm'),
          n_id: currentUser.userId,
          n_name: currentUser.name,
          team: currentUser.deptName,
          headqt: currentUser.prntDeptName,
          complete: 0,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`all${slug}s`],
      });
      fetchData(); // Call fetchData to refresh the list
      setOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
    setOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setOpen]);

  return (
    <div className="add">
      <div className="modal">
        <IconButton className="close" onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
        <div className="titleContainer">
          <DriveFileRenameOutlineIcon className="icon" />
          <h1>새로운 글 등록하기</h1>
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
          <Button variant="contained" color="primary" type="submit">새로운 글 등록하기</Button>
        </form>
      </div>
    </div>
  )
}

export default Add