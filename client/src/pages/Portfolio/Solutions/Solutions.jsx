import { useEffect, useRef, useState } from "react";
import "./solutions.scss";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import axios from "axios";



const Single = ({ item }) => {
  const ref = useRef()
  const { scrollYProgress } = useScroll({
    target: ref,
  });
  const y = useTransform(scrollYProgress, [0, 1], [-300, 300]);
  const handleLinkClick = () => {
    const url = `${window.location.origin}/product/${item.id}`;
    window.open(url, '_blank');
  };

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="imgContainer" ref={ref}>
            <img src={item.img} alt="" />
          </div>
          <motion.div className="textContainer" style={{ y }}>
            <h2 >{item.title}</h2>
            <p className="sub">{item.sol_full_name}</p>
            <p className="kor">{item.kor_name}</p>
            <div className="devWrap">
              {item.developers.map((developer, index) => (
                <p key={index} className="developer">{developer}</p>
              ))}
              {item.teams.map((team, index) => (
                <p key={index} className="team">{team}</p>
              ))}
            </div>
            <p className="desc">{item.desc}</p>
            <button onClick={handleLinkClick}>Solution 바로가기</button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const Solutions = () => {
  const ref = useRef()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const [items, setItems] = useState([]);
  const fetchSolutions = async () => {
    try {
      const response = await axios.get('/api/solutions/getsolution');
      const filteredSolutions = response.data.filter(solution => solution.wgroup === "2024");
      const initialItems = [
        {
          id: 25,
          developers: ["장진혁", "주홍민", "채경훈"],
          teams: ["충남품질혁신팀", "경북품질혁신팀", "목포품질개선팀"],
          desc: "무선국 정기검사에 반복적 투입하는 업무를 자동화하여 현장 생산성 개선하였습니다. 무선국 정기검사 대상의 서류 현황 비교 및 현항 Dash Board 등 여러가지 기능을 구현하였습니다."
        },
        {
          id: 34,
          developers: ["전다현", " ", " "],
          teams: ["강북품질혁신팀", " ", " "],
          desc: "지하철 통신실 온도 데이터를 Chat Bot을 통해서 제공하여, 현장의 이상 유무를 판단하여 안정적인 기지국 환경을 구현하고자 합니다.",
        },
        {
          id: 30,
          developers: ["소우철", " ", " "],
          teams: ["백본SO팀", " ", " "],
          desc: "교대 조직 특화 Platform 개발을 통한 업무 효율화 및 생산성 강화를 목표로 개발을 추진하였습니다.기존에는 교대 근무자 간의 업무 내용을 전달하고 이력을 관리하는데 많은 어려움이 있었습니다. 이를 해결하기 위해, 교대 근무와 관련된 업무 내용을 MySQL DataBase 로 체계적으로 관리하고, 각 조직별로 상이한 업무 관리 프로세스를 표준화하여 보다 효율적인 관리가 가능하도록 Platform 을 구축하였습니다.",
        },
        {
          id: 31,
          developers: ["나용욱", " ", " "],
          teams: ["보라매SO팀", " ", " "],
          desc: "통계 전처리와 데이터 시각화를 자동화함으로써, 고장 발생 시 신속한 대응 및 품질 업무에 대한 리소스 최적화를 목표로 개발을 추진하였습니다.",
        },
        {
          id: 29,
          developers: ["임준영", " ", " "],
          teams: ["관악품질개선팀", " ", " "],
          desc: "반복 적인 포트 추천과 DATA 추출 과정을 자동화 함으로써, 일의 효율성 Up! 자동화 Logic을 통한 신뢰성 Up! 현장의 Resource 최적화를 목표로 개발을 추진하였습니다.",
        },
        {
          id: 28,
          developers: ["윤주빈", " ", " "],
          teams: ["인천품질혁신팀", " ", " "],
          desc: "5G LSH 위경도 오류 대상을 자동으로 발췌하고 해결방안을 추천함으로써, 현장 RSC 효율화 및 고객부정경험을 사전적/선제적으로 예방할 수 있도록 구현하였습니다.",
        },
        {
          id: 24,
          developers: ["이진수", " ", " "],
          teams: ["평택품질개선팀", " ", " "],
          desc: "전사의 B2B국소를 대상으로 고장을 효율적으로 관리할 수 있도록 구현하였습니다. 알람 리스트, Map, 업무일지 이력, RSSI Trend 확인 등 기존 Tool의 일부 기능을 통합하여 구성하였습니다.",
        },
        {
          id: 36,
          developers: ["이민지", " ", " "],
          teams: ["경남품질혁신팀", " ", " "],
          desc: "공동망 지역에서 VOC 등 현장Issue 발생시 MAP 기반 해당구역 CELL TYPE 경계 자동화 구분 및 품질 정보제공으로 현장 Rsc. 감소와 품질 불량국소 자동 추출 및 센싱으로 VOC 인입전 사전적/선제적 예방을 추진 하고자 합니다. "
        },
        {
          id: 35,
          developers: ["김영석", " ", " "],
          teams: ["정읍품질개선팀", " ", " "],
          desc: "기존 전기료 소급 업무는 건물주 방문 후 사무실에 들어와 산출내역서를 작성하는 비효율적인 Process를 가지고 있었습니다. 그로 인해 파생되는 Resource 누수를 해결하기 위해 산출내역서 작성 자동화 및 이메일 발송 System을 구축하여 효율적인 업무 Process를 구축하였습니다.",
        },

        {
          id: 37,
          developers: ["강지원", " ", " "],
          teams: ["충북품질혁신팀", " ", " "],
          desc: "기지국 축전지 상태현황에 대한 시각적 통계 자료 제공과 축전지 점검일자 도래국소에 대한 noti 기능을 구현하여 기지국 축전지 안정운용 및 사무인력 효율화를 추진 하고자 합니다."
        },
        {
          id: 32,
          developers: ["박준성", "이종", " "],
          teams: ["춘천품질개선팀", "강원Access관제팀", " "],
          desc: "품질 불량 국소의 다양한 환경을 분석하고, 분석된 내용을 토대로 장비 Performance극대화를 위한 품질 개선 솔루션을 제공하고자 합니다.",
        },
        {
          id: 33,
          developers: ["이상무", " ", " "],
          teams: ["동부Access관제팀", " ", " "],
          desc: "알람 및 ESG 동작 없이 No Call이 발생한 Cell을 자동으로 추출하고 Trend를 분석하며, 각 시스템에서 찾기 어려운 여러가지 센싱 Pain Point 개선을 목표로 하고 있습니다.",
        },
        {
          id: 27,
          developers: ["박재희", " ", " "],
          teams: ["서부Access관제팀", " ", " "],
          desc: "홈앤서비스에서 사내망 접속 어려움으로 인한 예고 정전 정보를 받을 수 없어 불필요한 현장 대응 Resource 가 발생하고 있습니다. OH 관점에서 예고정전 작업 정보를 메일 공유를 통해 지역별 정전 정보를 받아불필요 대응 Resouce를 ER 할 수 있게 공유하고 있습니다. ",
        },
        {
          id: 38,
          developers: ["강인하", " ", " "],
          teams: ["동부Core설비팀", " ", " "],
          desc: "전기차 충전기 구축 공사 관련 각 협력사의 설계 오류에 의한 발주사(파킹클라우드) 신뢰도 저하! 전기안전공사 사용 전 검사 부적합 판정 사례 발생!이러한 문제를 뿌리 뽑고자 KEC 및 발주사 시방서 내 공법을 준수하는 Tool을 개발하여 설계 오류 감소 및 경쟁력(신뢰도)을 확보하였습니다.",
        },
        {
          id: 26,
          developers: ["장대준", " ", " "],
          teams: ["전송기술팀", " ", " "],
          desc: "BP사 평가 기준 추가 및 재정립으로 변경 및 추가된 항목을 수정/보완을 하였으며,안전/운용활동/관리 감독자 평가 등 다방면으로 검증한 내용을 통한 공정한 평가가 가능하도록 하였습니다.",
        },
      ];

      // items 배열 업데이트
      const updatedItems = initialItems.map(item => {
        const matchedSolution = filteredSolutions.find(solution => solution.id === item.id);
        const imgPath = `${process.env.PUBLIC_URL}/image/workingGroup/intro${item.id}.png`;
        if (matchedSolution) {
          return {
            ...item,
            img: imgPath,
            title: matchedSolution.sol_name,
            sol_full_name: matchedSolution.sol_full_name,
            kor_name: matchedSolution.kor_name,
            // developer1: matchedSolution.name,
            // team1: matchedSolution.team,
            developers: [matchedSolution.name, item.developers[1], item.developers[2]].filter(Boolean),
            teams: [matchedSolution.team, item.teams[1], item.teams[2]].filter(Boolean),
          };
        }
        return item;
      });


      setItems(updatedItems);
    } catch (error) {
      console.error("solutions 가져올때 오류가 발생하였습니다:", error);
    }
  };
  useEffect(() => {
    fetchSolutions();
  }, []);
  // console.log("포트폴리오 soltuions에서 보는 items : ", items);





  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  return (
    <div className="solutions" ref={ref}>
      <div className="progress">
        <div className="title">
          <span className="first">'24년 </span>
          <span className="second">AI/DT Working Group </span>
          <span className="first"> Solutions를 소개합니다.</span>
        </div>
        <motion.div style={{ scaleX }} className="progressBar"></motion.div>
      </div>

      {items.map(item => (
        <Single item={item} key={item.id} />
      ))}
    </div>


  )
}

export default Solutions