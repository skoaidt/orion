import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const ShowButtonClick = () => {
      if (window.scrollY > 800) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }
    window.addEventListener("scroll", ShowButtonClick)
    return () => {
      window.removeEventListener("scroll", ShowButtonClick)
    }
  }, [])

  return (
    <>
      {showButton &&
        <div className="scroll-button" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
      }
    </>
  );
};

export default ScrollToTop;