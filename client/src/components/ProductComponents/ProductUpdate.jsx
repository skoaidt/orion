import "./productComponents.scss";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { BsFloppy2Fill } from "react-icons/bs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export const ProductUpdate = ({
  solutionData,
  productId,
  getDevelopers,
  useState,
}) => {
  const [direc, setDirec] = useState(solutionData.direc);
  const [target, setTarget] = useState(solutionData.target);
  const [effect, setEffect] = useState(solutionData.effect);
  const [developerInfo, setDeveloperInfo] = useState("");
  const developerData = getDevelopers.find(
    (developer) => developer.n_id === solutionData.n_id
  );
  const maxChars = 300; // 개발자 소개글 최대 문자 수
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    sol_name: solutionData.sol_name || "",
    sol_full_name: solutionData.sol_full_name || "",
    kor_name: solutionData.kor_name || "",
    work_field: solutionData.work_field || "",
    url: solutionData.url || "",
    github_url: solutionData.github_url || "",
    version: solutionData.version || "",
    reupdate: solutionData.reupdate || "",
    reg_date: solutionData.reg_date || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    developerData?.dev_img ||
      `${process.env.PUBLIC_URL}/image/developer/basic.jpg`
  );

  // Warning 잡는 로직 인데, 안잡힘 : Listener added for a synchronous 'DOMNodeInserted' DOM Mutation Event.
  const quillRef = useRef(null);
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      console.log("ReactQuill 내부 DOM 변화 감지됨", mutations);
    });
    const config = {
      childList: true,
      subtree: true,
    };
    const editor = quillRef.current ? quillRef.current.getEditor().root : null;
    if (editor) {
      observer.observe(editor, config);
    }
    return () => observer.disconnect();
  }, []);
  // Solution Contents 수정하기
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/solutions/update/${productId}`, {
        direc,
        target,
        effect,
      });
      alert("업데이트 성공!");
      navigate(`/product/${productId}/`);
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("업데이트에 실패했습니다.");
    }
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [
        {
          color: [
            "black",
            "gray",
            "red",
            "green",
            "blue",
            "orange",
            "violet",
            "#d0d1d2",
          ],
        },
        { background: [] },
      ],
      [{ align: [] }],
    ],
  };

  // 개발자 소개글 수정하기
  useEffect(() => {
    if (developerData) {
      setDeveloperInfo(developerData.introduction);
    }
  }, [developerData]);

  // 개발자 소개글
  const handleDevIntroUpdate = async (e) => {
    e.preventDefault();
    // 개발자 리스트가 없을 경우 저장을 중단하고 경고 메시지를 보여줍니다.
    if (developerData === undefined) {
      alert(
        "개발자로 등록되지 않아서, 소개글을 수정할 수 없습니다. 담당자에게 개발자 등록요청해주세요."
      );
      return; // 함수 실행을 여기서 중단합니다.
    }
    try {
      await axios.put("/api/developers/updatedevintro", {
        n_id: solutionData.n_id,
        introduction: developerInfo,
      });
      alert("개발자 소개글 업데이트 완료했습니다.");
      navigate(`/product/${productId}/`);
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("개발자 소개글 업데이트에 실패했습니다.");
    }
  };

  // 개발자 이미지
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile); // 파일 추가
      console.log("업로드 시도: ", imageFile); // 업로드 시도하는 파일 로그
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const res = await axios.post("/api/upload/developers", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // 필요한 경우 명시적으로 세팅
        },
      });
      console.log("업로드 성공: ", res.data); // 응답 로그
      return res.data;
    } catch (err) {
      console.error("업로드 실패: ", err);
    }
  };
  // 개발자 이미지
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      let reader = new FileReader();

      reader.onloadend = () => {
        setImageFile(file); // 업로드할 파일 상태 업데이트
        setImagePreviewUrl(reader.result); // 미리보기 URL 업데이트
      };

      reader.readAsDataURL(file);
    }
  };
  // 개발자 이미지
  const handleUploadClick = async (e) => {
    e.preventDefault();
    const dev_img = (await upload()).filePath;
    console.log("handaleUpladClick에 들어온 imgPath", dev_img);
    const imgData = { dev_img, n_id: developerData.n_id };
    try {
      const response = await axios.put(
        "/api/developers/updatedevimg",
        imgData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("서버로부터 받은 데이터:", response.data);
        alert("개발자 이미지 변경 성공!");
        navigate(`/product/${productId}/`);
      } else {
        throw new Error("이미지 등록에 실패했습니다.");
      }
    } catch (error) {
      let errorMessage = "이미지 등록 실패";
      if (error.response && error.response.status === 409) {
        errorMessage = error.response.data;
      } else {
        errorMessage = `이미지 등록 실패: ${error.message}`;
      }
      alert(errorMessage);
      console.error("이미지 등록 중 에러 발생", error);
    }
  };

  // Solution 부가 정보 수정하기
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSolUpateEtc = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/solutions/updatesoletc/${productId}`, {
        sol_name: formValues.sol_name,
        sol_full_name: formValues.sol_full_name,
        kor_name: formValues.kor_name,
        work_field: formValues.work_field,
        url: formValues.url,
        github_url: formValues.github_url,
        version: formValues.version,
        reupdate: formValues.reupdate,
        reg_date: formValues.reg_date,
      });
      alert("부가정보 업데이트 성공!");
      navigate(`/product/${productId}/`);
    } catch (error) {
      console.error("업데이트 실패 : ", error);
      alert("업데이트에 실패했습니다.");
    }
  };
  // console.log("developerData n_id ? ", developerData.n_id);
  return (
    <div className="contentBox">
      <div className="container">
        <div className="innerBox">
          <div className="leftSide">
            <div className="gap-60"></div>
            <div className="titleBox">
              <div className="title">Product Edit</div>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="desc">
                <div className="gap-20"></div>
                <div className="subTitle">추진 방향</div>
                <div className="editorContainer">
                  <ReactQuill
                    ref={quillRef}
                    className="editor"
                    theme="snow"
                    modules={modules}
                    value={direc}
                    onChange={setDirec}
                  />
                </div>

                <div className="gap-20"></div>
                <div className="subTitle">추진 내역</div>
                <div className="editorContainer">
                  <ReactQuill
                    ref={quillRef}
                    className="editor"
                    theme="snow"
                    modules={modules}
                    value={target}
                    onChange={setTarget}
                  />
                </div>

                <div className="gap-20"></div>
                <div className="subTitle">기대 효과</div>
                <div className="editorContainer">
                  <ReactQuill
                    ref={quillRef}
                    className="editor"
                    theme="snow"
                    modules={modules}
                    value={effect}
                    onChange={setEffect}
                  />
                </div>
              </div>
              <div className="gap-20"></div>
              <button className="updBtn" type="submit">
                <BsFloppy2Fill /> 내용 업데이트 하기
              </button>
            </form>
          </div>{" "}
          <div className="productUpdate">
            <div className="rightSide">
              <div className="devDesc">
                <div className="developer">
                  <div className="gap-20"></div>
                  <div className="title">개발자 사진 변경</div>
                  <img src={imagePreviewUrl} className="devImg" alt="devImg" />
                  <div>
                    <span style={{ color: "#585858" }}>
                      {solutionData.headquarters}{" "}
                    </span>
                    <span style={{ color: "#1CA8DB" }}>
                      {solutionData.team}{" "}
                    </span>
                    <div className="devNm">{solutionData.name}</div>
                  </div>
                  <div className="imgBtn">
                    <div>
                      <input
                        style={{ display: "none" }}
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="fileInput">
                        <Button fullWidth component="span" variant="contained">
                          이미지 선택
                        </Button>
                      </label>
                    </div>
                    <div>
                      <Button
                        fullWidth
                        onClick={handleUploadClick}
                        variant="contained"
                        color="primary"
                      >
                        이미지 업데이트
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="gap-20"></div>
                <hr style={{ width: "80%" }} />
                <div className="gap-40"></div>
                <div className="title">Product 세부내용 Edit</div>
                <div className="gap-20"></div>
                <div className="langDesc">
                  <form onSubmit={handleSolUpateEtc}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Solution 이름"
                          name="sol_name"
                          variant="outlined"
                          value={formValues.sol_name}
                          onChange={handleChange}
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Solution Full Name"
                          name="sol_full_name"
                          variant="outlined"
                          value={formValues.sol_full_name}
                          onChange={handleChange}
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Solution 한글 명칭"
                          name="kor_name"
                          variant="outlined"
                          value={formValues.kor_name}
                          onChange={handleChange}
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      {/* <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="업무 직군"
                          name="work_field"
                          variant="outlined"
                          value={formValues.work_field}
                          onChange={handleChange}
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid> */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            border: 1,
                            borderColor: "grey.400",
                            borderRadius: "5px",
                            p: 2,
                          }}
                        >
                          <FormControl component="fieldset">
                            <FormLabel component="legend">업무 직군</FormLabel>
                            <RadioGroup
                              row
                              aria-label="work_field"
                              name="work_field"
                              value={formValues.work_field}
                              onChange={handleChange}
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
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Site URL"
                          name="url"
                          variant="outlined"
                          value={formValues.url}
                          onChange={handleChange}
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Github URL"
                          name="github_url"
                          variant="outlined"
                          value={formValues.github_url}
                          onChange={handleChange}
                          type="text"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="개발 일자"
                          name="reg_date"
                          variant="outlined"
                          value={formValues.reg_date}
                          onChange={handleChange}
                          type="date"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Version"
                          name="version"
                          variant="outlined"
                          value={formValues.version}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="최근 업데이트"
                          name="reupdate"
                          variant="outlined"
                          value={formValues.reupdate}
                          onChange={handleChange}
                          type="date"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          업데이트
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </div>
                <div className="gap-20"></div>
                <hr style={{ width: "80%" }} />
                <div className="gap-20"></div>
                <div className="title">개발자 소개글 수정</div>
                <div className="gap-20"></div>
                <form onSubmit={handleDevIntroUpdate}>
                  <TextField
                    variant="outlined"
                    margin="none"
                    fullWidth
                    name="introduction"
                    label="개발자 소개글"
                    type="text"
                    id="introduction"
                    autoComplete="introduction"
                    multiline
                    rows={6}
                    value={developerInfo}
                    onChange={(e) => setDeveloperInfo(e.target.value)}
                    inputProps={{
                      maxLength: maxChars,
                    }}
                    // 입력 필드 아래에 남은 글자 수를 보여줍니다.
                    helperText={`등록한 글자 수: ${developerInfo.length} / 최대 글자 수 : ${maxChars}`}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    소개글 업데이트
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-60"></div>
      </div>

      <div className="gap-60"></div>
    </div>
  );
};

export default ProductUpdate;
