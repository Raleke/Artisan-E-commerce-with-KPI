import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedSection = ({ children, direction = "left" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{
        x: direction === "left" ? -100 : 100,
        opacity: 0,
      }}
      animate={{
        x: inView ? 0 : direction === "left" ? -100 : 100,
        opacity: inView ? 1 : 0,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
