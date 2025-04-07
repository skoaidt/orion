import React, { useState, useRef, useEffect, useContext } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import { styled } from "@mui/system";
import { Select as BaseSelect } from "@mui/base/Select";
import { Option as BaseOption } from "@mui/base/Option";

const IdeaRegister = ({ onClose }) => {
  const { currentUser } = useContext(AuthContext);
  // 각 Select 컴포넌트별로 독립적인 상태 생성
  const [businessField, setBusinessField] = React.useState("");
  const [jobField, setJobField] = React.useState("");
  const [usability, setUsability] = React.useState("");
  const [duplication, setDuplication] = React.useState("");
  const [tbohStatus, setTbohStatus] = React.useState("");
  const [personName, setPersonName] = React.useState([]);
  const [usePeriod, setUsePeriod] = React.useState("");
  const [useScope, setUseScope] = React.useState("");
  const [platform, setPlatform] = React.useState("");

  // 각 에디터별 개별 상태값 생성
  const [background, setBackground] = useState("");
  const [progress, setProgress] = useState("");
  const [quantitativeEffect, setQuantitativeEffect] = useState("");
  const [qualitativeEffect, setQualitativeEffect] = useState("");

  // 부서 검증을 위한 상태 추가
  const [verifyDepartment, setVerifyDepartment] = useState(null);

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
    "Biz",
    "Process",
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

  const handleUsePeriodChange = (event) => {
    setUsePeriod(event.target.value);
  };

  const handleUseScopeChange = (event) => {
    setUseScope(event.target.value);
  };

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  // 조직도 데이터 구조
  const organizationData = {
    Access본부: {
      담당들: {
        Access계획담당: ["Access계획팀", "Access시스템팀", "계약팀"],
        Access운용담당: ["Access운용1팀", "Access운용2팀", "Access품질팀"],
      },
      직속팀들: ["Access전략팀", "Access신기술팀", "Access지원팀"],
    },
    Network본부: {
      담당들: {
        Network계획담당: ["Network계획팀", "Network시스템팀", "Network구축팀"],
        Network운용담당: ["Network운용1팀", "Network운용2팀", "Network품질팀"],
      },
      직속팀들: ["Network전략팀", "Network신기술팀", "Network지원팀"],
    },
    IT본부: {
      담당들: {
        IT기획담당: ["IT기획팀", "IT아키텍처팀", "IT보안팀"],
        IT개발담당: ["IT개발1팀", "IT개발2팀", "데이터팀"],
      },
      직속팀들: ["IT전략팀", "IT품질팀", "IT지원팀"],
    },
    "AI/DT본부": {
      담당들: {
        AI기획담당: ["AI기획팀", "AI아키텍처팀", "AI솔루션팀"],
        데이터담당: ["데이터분석팀", "AI개발팀", "빅데이터팀"],
      },
      직속팀들: ["AI전략팀", "데이터품질팀", "AI지원팀"],
    },
  };

  // 부서 선택 관련 상태 및 핸들러
  const [selectedHeadquarter, setSelectedHeadquarter] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [teams, setTeams] = React.useState([]);

  // 본부 선택 시
  const handleHeadquarterChange = (event, value) => {
    setSelectedHeadquarter(value);
    setSelectedDepartment(""); // 담당 초기화
    setSelectedTeam(""); // 팀 초기화
    setTeams([]); // 팀 목록 초기화
  };

  // 담당 선택 시
  const handleDepartmentChange = (event, value) => {
    setSelectedDepartment(value);
    setSelectedTeam(""); // 팀 초기화

    if (value === "선택없음") {
      // 직속 팀 설정
      setTeams(organizationData[selectedHeadquarter].직속팀들);
    } else if (organizationData[selectedHeadquarter]?.담당들[value]) {
      // 담당의 팀 설정
      setTeams(organizationData[selectedHeadquarter].담당들[value]);
    }
  };

  // 팀 선택 시
  const handleTeamChange = (event, value) => {
    setSelectedTeam(value);

    // 선택된 부서 정보 상태 업데이트
    const departmentInfo = {
      headquarter: selectedHeadquarter,
      department: selectedDepartment,
      team: value,
      // 표시용 전체 경로
      fullPath:
        selectedDepartment === "선택없음"
          ? `${selectedHeadquarter} > ${value}`
          : `${selectedHeadquarter} > ${selectedDepartment} > ${value}`,
    };
    setVerifyDepartment(departmentInfo);
  };

  // 등록 버튼 핸들러
  const handleSubmit = async () => {
    try {
      // 검증 부서가 선택되었는지 확인
      if (!verifyDepartment || !verifyDepartment.team) {
        alert("검증 부서를 선택해주세요.");
        return; // 함수 실행 중단
      }

      // 각 입력 필드의 값을 수집
      const ideaData = {
        title: document.querySelector(".titleInput").value,
        background,
        progress,
        quantitative_effect: quantitativeEffect,
        qualitative_effect: qualitativeEffect,
        project_type:
          document.querySelector(
            'input[name="row-radio-buttons-group"]:checked'
          )?.value || "",
        target_user:
          document.querySelector(
            'input[name="row-radio-buttons-group2"]:checked'
          )?.value || "",
        business_field: businessField,
        job_field: jobField,
        usability: usability,
        duplication: duplication,
        tboh_status: tbohStatus,
        use_period: usePeriod,
        use_scope: useScope,
        platform: platform,
        usability_points: personName.join(","), // 배열을 문자열로 변환
        improvement_points: personName.join(","), // 개선내역도 같은 state를 사용 중이므로 수정 필요
        // 로그인한 사용자 정보 추가
        user_id: currentUser?.userId || "", // 사번
        name: currentUser?.name || "", // 이름
        prnt_dept_name: currentUser?.prntDeptName || "", // 제안본부
        dept_name: currentUser?.deptName || "", // 제안팀
        // 검증 부서 정보 추가 - 팀 정보만 저장
        VerifyDepartment: verifyDepartment ? verifyDepartment.team : "",
      };

      console.log("등록할 아이디어 데이터:", ideaData);

      // API 호출하여 데이터베이스에 저장
      const response = await axios.post("/api/ideas/register", ideaData);

      console.log("아이디어 등록 성공:", response.data);
      alert("아이디어가 성공적으로 등록되었습니다.");

      // 등록 후 모달 닫기
      onClose();
    } catch (error) {
      console.error("아이디어 등록 오류:", error);

      // 서버에서 반환된 오류 메시지 표시 - 개선된 오류 처리
      if (error.response) {
        // 서버에서 응답이 왔지만 오류 상태 코드인 경우
        if (
          error.response.status === 400 &&
          error.response.data.missingFields
        ) {
          // 필수 항목 누락 오류
          const missingFields = error.response.data.missingFields.join(", ");
          alert(
            `필수 항목이 누락되었습니다. 다음 항목을 확인해주세요: ${missingFields}`
          );
        } else {
          // 다른 종류의 서버 오류
          alert(
            `오류: ${
              error.response.data.error ||
              error.response.data.message ||
              "알 수 없는 오류가 발생했습니다."
            }`
          );
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        alert("서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        // 요청 설정 중 오류 발생
        alert(`요청 오류: ${error.message}`);
      }
    }
  };

  // VerifyDepartment 컴포넌트를 위한 스타일 컴포넌트들
  const SelectCustomButton = styled("button")(({ theme }) => ({
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px 12px",
    width: "100%",
    textAlign: "left",
    backgroundColor: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#aaa",
    },
    "&:focus": {
      outline: "none",
      borderColor: "#2e7d32",
      boxShadow: "0 0 0 2px rgba(46, 125, 50, 0.2)",
    },
  }));

  const SelectOption = styled(BaseOption)(({ theme }) => ({
    listStyle: "none",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    "&.Mui-selected": {
      backgroundColor: "#e0e0e0",
      "&:hover": {
        backgroundColor: "#d0d0d0",
      },
    },
  }));

  const SelectListbox = styled("ul")(({ theme }) => ({
    margin: "8px 0",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    maxHeight: "200px",
    overflowY: "auto",
  }));

  const SelectPopup = styled("div")(({ theme }) => ({
    zIndex: 1000,
  }));

  const SelectContainer = styled("div")({
    marginBottom: "16px",
  });

  // 부서 선택 Select 컴포넌트
  const DepartmentSelect = React.forwardRef(function Select(props, ref) {
    const slots = {
      root: SelectCustomButton,
      listbox: SelectListbox,
      popup: SelectPopup,
      ...props.slots,
    };

    return <BaseSelect {...props} ref={ref} slots={slots} />;
  });

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="titleBox">
          <h2>IDEA 등록</h2>
          <CloseIcon className="closeIcon" onClick={onClose} />
        </div>
        <hr className="titleUnderline" />
        <div className="ideaRegister">
          <div className="left">
            <div className="titleWrap">
              <div className="titleBox">
                <div className="title">제목</div>
              </div>
              <div className="desc">
                <input
                  type="text"
                  className="titleInput"
                  placeholder="제목을 입력하세요"
                  style={{ width: "99%" }}
                />
              </div>
            </div>
            <div className="gap-10"></div>
            <div className="contentBox">
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">추진 배경</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
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
                  </div>
                </form>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">추진 내역</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
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
                  </div>
                </form>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">정량적 효과</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
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
                  </div>
                </form>
              </div>
              <div className="innerBox">
                <div className="titleBox">
                  <div className="title">정성적 효과</div>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="desc">
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
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="right">
            <div className="projectCategory">
              <span className="fieldLabel">개발 유형</span>
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
              <span className="fieldLabel">사용 대상</span>
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
              <span className="fieldLabel">사업분야</span>
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
                <span className="fieldLabel">업무분야</span>
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
                    id="use-period-select"
                    value={usePeriod}
                    onChange={handleUsePeriodChange}
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
                    id="use-scope-select"
                    value={useScope}
                    onChange={handleUseScopeChange}
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
                  id="platform-select"
                  value={platform}
                  onChange={handlePlatformChange}
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
              <FormControl sx={{ m: 0, width: 300 }}>
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
              <FormControl sx={{ m: 0, width: 300 }}>
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

            {/* 검증 부서 컨테이너 추가 */}
            <div className="projectCategory">
              <span className="fieldLabel">검증 부서</span>
              <div className="verifyDepartmentContainer">
                {verifyDepartment && (
                  <div className="selectedDepartmentInfo">
                    <p>선택된 검증 부서: {verifyDepartment.fullPath}</p>
                  </div>
                )}
                <div className="selectorsRow">
                  <SelectContainer>
                    <DepartmentSelect
                      value={selectedHeadquarter}
                      onChange={handleHeadquarterChange}
                      placeholder="본부를 선택하세요"
                    >
                      {Object.keys(organizationData).map((headquarter) => (
                        <SelectOption key={headquarter} value={headquarter}>
                          {headquarter}
                        </SelectOption>
                      ))}
                    </DepartmentSelect>
                  </SelectContainer>

                  <SelectContainer>
                    <DepartmentSelect
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                      placeholder="담당을 선택하세요"
                      disabled={!selectedHeadquarter}
                    >
                      {selectedHeadquarter &&
                        Object.keys(
                          organizationData[selectedHeadquarter].담당들
                        ).map((department) => (
                          <SelectOption key={department} value={department}>
                            {department}
                          </SelectOption>
                        ))}
                      {selectedHeadquarter && (
                        <SelectOption value="선택없음">
                          직속팀 선택
                        </SelectOption>
                      )}
                    </DepartmentSelect>
                  </SelectContainer>

                  <SelectContainer>
                    <DepartmentSelect
                      value={selectedTeam}
                      onChange={handleTeamChange}
                      placeholder="팀을 선택하세요"
                      disabled={!selectedDepartment || teams.length === 0}
                    >
                      {teams.map((team) => (
                        <SelectOption key={team} value={team}>
                          {team}
                        </SelectOption>
                      ))}
                    </DepartmentSelect>
                  </SelectContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="buttonContainer">
          <button className="cancelButton" onClick={onClose}>
            취소
          </button>
          <button className="registerButton" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaRegister;
