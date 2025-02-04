import React from 'react'

export const Footer = () => {

  return (
    <footer className="footer">
      <div className="footerBox">

        <div className="leftSide">
          <img src={`${process.env.PUBLIC_URL}/image/logo/OrionW.png`} alt="mainLogo" />
          <p><b>Create Infra AI/DT ,</b> <span style={{ fontSize: "12px", color: "#fafafa" }}>Developer K Y</span></p>
        </div>
        <div className="rightSide">
          <p className="title">(주)SK오앤에스</p>
          <p>서울특별시 영등포구 선유로49길 23 아이에스비즈타워2차 9층</p>
        </div>
      </div>
    </footer>
  )
}


export default Footer;