import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const skills = [
  'penetration testing',
  'full stack development',
  'network security',
  'cloud architecture',
  'incident response',
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

export function TypewriterText() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  return (
    <motion.div
      className="font-mono text-sm space-y-2"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {skills.map(skill => (
        <motion.div key={skill} variants={itemVariants} className="text-green-500">
          <span className="text-gray-500">$</span> {skill}
        </motion.div>
      ))}
    </motion.div>
  );
}
