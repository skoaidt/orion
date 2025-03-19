import React, { useState, useRef, useEffect } from "react";
import "./ideaRegister.scss";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const IdeaRegister = ({ onClose }) => {
  const [businessField, setBusinessField] = React.useState("");
  const [jobField, setJobField] = React.useState("");
  const [usability, setUsability] = React.useState("");
  const [duplication, setDuplication] = React.useState("");
  const [tbohStatus, setTbohStatus] = React.useState("");
  const [personName, setPersonName] = React.useState([]);

  // 각 에디터별 개별 상태값 생성
  const [background, setBackground] = useState("");
  const [progress, setProgress] = useState("");
  const [quantitativeEffect, setQuantitativeEffect] = useState("");
  const [qualitativeEffect, setQualitativeEffect] = useState("");

  // 각 에디터별 개별 ref 생성
  const backgroundRef = useRef(null);
  const progressRef = useRef(null);
  const quantitativeEffectRef = useRef(null);
  const qualitativeEffectRef = useRef(null);

  const handleBusinessFieldChange = (event) => {
    setBusinessField(event.target.value);
  };

  const handleJobFieldChange = (event) => {
    setJobField(event.target.value);
  };

  const handleUsabilityChange = (event) => {
    setUsability(event.target.value);
  };

  const handleDuplicationChange = (event) => {
    setDuplication(event.target.value);
  };

  const handleTbohStatusChange = (event) => {
    setTbohStatus(event.target.value);
  };

  const theme = useTheme();
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const getBetterList = [
    "분석",
    "공유",
    "편의성",
    "신뢰성확보",
    "보안",
    "자동화",
    "연동및연계",
    "Biz Process",
  ];

  const enhanceList = [
    "비용절감",
    "생산성향상",
    "지표개선",
    "ESG",
    "Biz관련",
    "품질",
    "VOC",
    "재난재해",
    "안전",
    "AI/DT",
    "RM및장애",
    "예방활동",
    "기타",
  ];

  function getStyles(name, personName, theme) {
    return {
      fontWeight: personName.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  // 각 에디터별 MutationObserver 설정
  useEffect(() => {
    const setupObserver = (ref, name) => {
      if (!ref.current) return;

      const observer = new MutationObserver((mutations) => {
        console.log(`${name} 에디터 내부 DOM 변화 감지됨`, mutations);
      });

      const config = {
        childList: true,
        subtree: true,
      };

      const editor = ref.current ? ref.current.getEditor().root : null;
      if (editor) {
        observer.observe(editor, config);
        return observer;
      }
      return null;
    };

    const backgroundObserver = setupObserver(backgroundRef, "추진 배경");
    const progressObserver = setupObserver(progressRef, "추진 내역");
    const quantitativeObserver = setupObserver(
      quantitativeEffectRef,
      "정량적 효과"
    );
    const qualitativeObserver = setupObserver(
      qualitativeEffectRef,
      "정성적 효과"
    );

    return () => {
      if (backgroundObserver) backgroundObserver.disconnect();
      if (progressObserver) progressObserver.disconnect();
      if (quantitativeObserver) quantitativeObserver.disconnect();
      if (qualitativeObserver) qualitativeObserver.disconnect();
    };
  }, []);

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

  // 폼 제출 핸들러 추가
  const handleUpdate = (e) => {
    if (e) e.preventDefault();
    // 실제 업데이트 로직 여기에 추가
    console.log("폼이 제출되었습니다");
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <p>아이디어 등록</p>
        <div className="ideaRegister">
          <div className="left">
            <div className="contentBox">
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">추진 배경</div>
                </div>
                <div className="desc">
                  <form onSubmit={handleUpdate}>
                    <div className="editorContainer">
                      <ReactQuill
                        ref={backgroundRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={background}
                        onChange={setBackground}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">추진 내역</div>
                </div>
                <div className="desc">
                  <form onSubmit={handleUpdate}>
                    <div className="editorContainer">
                      <ReactQuill
                        ref={progressRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={progress}
                        onChange={setProgress}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">정량적 효과</div>
                </div>
                <div className="desc">
                  <form onSubmit={handleUpdate}>
                    <div className="editorContainer">
                      <ReactQuill
                        ref={quantitativeEffectRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={quantitativeEffect}
                        onChange={setQuantitativeEffect}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">정성적 효과</div>
                </div>
                <div className="desc">
                  <form onSubmit={handleUpdate}>
                    <div className="editorContainer">
                      <ReactQuill
                        ref={qualitativeEffectRef}
                        className="editor"
                        theme="snow"
                        modules={modules}
                        value={qualitativeEffect}
                        onChange={setQualitativeEffect}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="projectCategory">
              <span className="fieldLabel">과제 유형</span>
              <FormControl>
                <RadioGroup row name="row-radio-buttons-group">
                  <FormControlLabel
                    value="신규개발"
                    control={<Radio />}
                    label="신규개발"
                  />
                  <FormControlLabel
                    value="고도화"
                    control={<Radio />}
                    label="고도화"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">개발 유형</span>
              <FormControl>
                <RadioGroup row name="row-radio-buttons-group2">
                  <FormControlLabel
                    value="전사"
                    control={<Radio />}
                    label="전사"
                  />
                  <FormControlLabel
                    value="협업"
                    control={<Radio />}
                    label="협업"
                  />
                  <FormControlLabel
                    value="자체"
                    control={<Radio />}
                    label="자체"
                  />
                  <FormControlLabel
                    value="TBOH"
                    control={<Radio />}
                    label="TBOH"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">사업 분야</span>
              <div className="fieldRow">
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="demo-simple-select-standard"
                    value={businessField}
                    onChange={handleBusinessFieldChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="Access">Access</MenuItem>
                    <MenuItem value="AOC">AOC</MenuItem>
                    <MenuItem value="Biz">Biz</MenuItem>
                    <MenuItem value="Infra설비">Infra설비</MenuItem>
                    <MenuItem value="SO">SO</MenuItem>
                    <MenuItem value="기업문화">기업문화</MenuItem>
                    <MenuItem value="안전보건">안전보건</MenuItem>
                    <MenuItem value="자산">자산</MenuItem>
                    <MenuItem value="전송">전송</MenuItem>
                  </Select>
                </FormControl>
                <span className="fieldLabel">업무 분야</span>
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="job-field-select"
                    value={jobField}
                    onChange={handleJobFieldChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="품질">품질</MenuItem>
                    <MenuItem value="고장">고장</MenuItem>
                    <MenuItem value="RM">RM</MenuItem>
                    <MenuItem value="시설">시설</MenuItem>
                    <MenuItem value="CE">CE</MenuItem>
                    <MenuItem value="사무">사무</MenuItem>
                    <MenuItem value="Biz">Biz</MenuItem>
                    <MenuItem value="기타">기타</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">활용도</span>
              <div className="fieldRow">
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="usability-select"
                    value={usability}
                    onChange={handleUsabilityChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="전사">전사</MenuItem>
                    <MenuItem value="본부">본부</MenuItem>
                    <MenuItem value="팀">팀</MenuItem>
                    <MenuItem value="담당자">담당자</MenuItem>
                    <MenuItem value="대외기관">대외기관</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                  </Select>
                </FormControl>
                <span className="fieldLabel">중복여부</span>
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="duplication-select"
                    value={duplication}
                    onChange={handleDuplicationChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="신규">신규</MenuItem>
                    <MenuItem value="타시스템 기능중복">
                      타시스템 기능중복
                    </MenuItem>
                    <MenuItem value="기존시스템 고도화">
                      기존시스템 고도화
                    </MenuItem>
                    <MenuItem value="기존시스템 개선추가">
                      기존시스템 개선추가
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">TBOH 여부</span>
              <RadioGroup
                row
                name="tboh-status-group"
                value={tbohStatus}
                onChange={handleTbohStatusChange}
              >
                <FormControlLabel
                  value="해당없음"
                  control={<Radio />}
                  label="해당없음"
                />
                <FormControlLabel value="TO" control={<Radio />} label="TO" />
                <FormControlLabel
                  value="TBOH"
                  control={<Radio />}
                  label="TBOH"
                />
                <FormControlLabel value="BOH" control={<Radio />} label="BOH" />
              </RadioGroup>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">활용기간</span>
              <div className="fieldRow">
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="demo-simple-select-standard"
                    value={businessField}
                    onChange={handleBusinessFieldChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="매일">매일</MenuItem>
                    <MenuItem value="주3회">주3회</MenuItem>
                    <MenuItem value="주1회">주1회</MenuItem>
                    <MenuItem value="월1회">월1회</MenuItem>
                    <MenuItem value="이벤트 발생시">이벤트 발생시</MenuItem>
                  </Select>
                </FormControl>
                <span className="fieldLabel">사용범위</span>
                <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                  <Select
                    id="job-field-select"
                    value={jobField}
                    onChange={handleJobFieldChange}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="필수사용">필수사용</MenuItem>
                    <MenuItem value="선택적사용">선택적사용</MenuItem>
                    <MenuItem value="대체가능">대체가능</MenuItem>
                    <MenuItem value="미사용 무방">미사용 무방</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">플랫폼</span>
              <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                <Select
                  id="demo-simple-select-standard"
                  value={businessField}
                  onChange={handleBusinessFieldChange}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="Web">Web</MenuItem>
                  <MenuItem value="Mobile">Mobile</MenuItem>
                  <MenuItem value="Noti">Noti</MenuItem>
                  <MenuItem value="Web+Mobile">Web+Mobile</MenuItem>
                  <MenuItem value="Web+Noti">Web+Noti</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">유용성</span>
              <FormControl sx={{ m: 0, width: 200 }}>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  variant="standard"
                  MenuProps={MenuProps}
                >
                  {getBetterList.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, personName, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="projectCategory">
              <span className="fieldLabel">개선내역</span>
              <FormControl sx={{ m: 0, width: 200 }}>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  variant="standard"
                  MenuProps={MenuProps}
                >
                  {enhanceList.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, personName, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaRegister;
