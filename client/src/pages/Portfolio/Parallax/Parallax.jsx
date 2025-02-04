import { useRef } from "react";
import "./parallax.scss";
import { motion, useScroll, useTransform } from "framer-motion";

const Parallax = () => {

  const ref = useRef();
  const mountainsImage = `${process.env.PUBLIC_URL}/image/workingGroup/mountains.png`;
  const planetsImage = `${process.env.PUBLIC_URL}/image/workingGroup/planets.png`;
  const starsIamge = `${process.env.PUBLIC_URL}/image/workingGroup/stars.png`;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "500%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);


  return (
    <div className="parallax"
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #111132, #0c0c1d)"
      }}
    >
      <motion.h1 style={{ y: yText }}>
        <span>AI/DT Working Group</span> <br /> <span>우리가 만들어 낸 Solution</span>
      </motion.h1>
      <motion.div className="mountains" style={{ backgroundImage: `url(${mountainsImage})` }}></motion.div>
      <motion.div className="planets" style={{ y: yBg, backgroundImage: `url(${planetsImage})` }}></motion.div>
      <motion.div className="stars" style={{ x: yBg, backgroundImage: `url(${starsIamge})` }} ></motion.div>
    </div>
  )
}

export default Parallax