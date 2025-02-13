import { useState, useEffect } from "react";

const TypingList = ({ onSelectSentence }) => {
  const [typingList, setTypingList] = useState([]);

  const getRandomSentence = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    const selectedSentence = list[randomIndex].sentence;
    onSelectSentence(selectedSentence);
  };

  const fetchTypingData = async () => {
    try {
      const response = await fetch("/api/typings/typingdata");
      const data = await response.json();
      setTypingList(data);
      getRandomSentence(data);
    } catch (error) {
      console.error("타이핑 데이터를 가져오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchTypingData();
  }, []);

  return null;
};

export default TypingList;
