'use client';

import { motion, Variants } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const variants: Variants = {
  initial: {
    scale: 0.6,
    rotate: 90,
  },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10,
    },
  },
  exit: {
    scale: 0.6,
    rotate: -90,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10,
    },
  },
  hover: {
    scale: 1.2,
    rotate: 15,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.9,
    rotate: -15,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
};

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div initial="initial" animate="animate" exit="exit" variants={variants} key={theme}>
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-white" />
        ) : (
          <Moon className="w-5 h-5 text-black" />
        )}
      </motion.div>
    </motion.button>
  );
}
