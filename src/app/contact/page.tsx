'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { useEffect } from 'react';

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function ContactPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <PageTransition>
      <main className="h-screen bg-background text-foreground p-8 flex items-start pt-32 md:pt-32" style={{ overflow: 'hidden' }}>
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">contact</h1>
            <p className="text-muted mb-6 md:mb-8 mt-2 md:mt-3">
              get in touch with me for collaborations or just to say hi
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 md:gap-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <Link
              href="https://linkedin.com/in/rodrigoribeironline"
              target="_blank"
              className="no-underline"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center p-3 md:p-4 border border-muted rounded-lg hover:border-foreground bg-background"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4" />
                </motion.div>
                <div>
                  <h2 className="font-bold text-sm md:text-base">linkedin</h2>
                  <p className="text-muted text-xs md:text-sm">let&apos;s connect</p>
                </div>
              </motion.div>
            </Link>

            <Link href="https://github.com/0sum-git" target="_blank" className="no-underline">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center p-3 md:p-4 border border-muted rounded-lg hover:border-foreground bg-background"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Github className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4" />
                </motion.div>
                <div>
                  <h2 className="font-bold text-sm md:text-base">github</h2>
                  <p className="text-muted text-xs md:text-sm">check out my code</p>
                </div>
              </motion.div>
            </Link>

            <Link href="mailto:workrodrigoribeiro@gmail.com">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center p-3 md:p-4 border border-muted rounded-lg hover:border-foreground bg-background"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Mail className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4" />
                </motion.div>
                <div>
                  <h2 className="font-bold text-sm md:text-base">email</h2>
                  <p className="text-muted text-xs md:text-sm">get in touch via email: workrodrigoribeiro@gmail.com</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
