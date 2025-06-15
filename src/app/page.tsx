'use client';

import { Terminal, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useEffect } from 'react';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function HomePage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
        <div className="relative z-10 h-full">
          <div className="container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center py-8 sm:py-0 sm:mt-[70px] sm:mr-[200px] md:mr-[200px]">
            <div className="max-w-2xl mx-auto md:mx-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <Terminal className="w-6 h-6 mb-3" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight">
                  cybersecurity &
                  <br />
                  software developer
                </h1>
                <p className="text-xs sm:text-sm text-muted mb-3">
                  building secure systems and exceptional digital experiences.
                </p>
              </motion.div>

              <motion.div
                className="flex gap-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="https://linkedin.com/in/rodrigoribeironline" target="_blank">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    <Linkedin className="w-6 h-6" />
                  </motion.div>
                </Link>
                <Link href="https://github.com/rodrigofernandesribeiro" target="_blank">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center"
                  >
                    <Github className="w-6 h-6" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-muted transition-colors"
                  >
                    view projects
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition-colors"
                  >
                    contact me
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                className="mt-8 sm:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg sm:text-xl font-bold mb-2">hi, i&apos;m rodrigo</p>
                <p className="text-xs sm:text-sm text-muted mb-4 sm:mb-6">and welcome to my portfolio</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <motion.div
                    className="space-y-2 sm:space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-lg sm:text-xl font-bold">about me</h2>
                    <p className="text-xs sm:text-sm text-muted">
                      i&apos;m a recent graduate in cybersecurity who loves software engineering and
                      cybersecurity projects. i&apos;m passionate about creating secure and
                      innovative software solutions. always eager to explore new technologies and
                      tackle challenging projects.
                    </p>
                  </motion.div>
                  <motion.div
                    className="space-y-3 sm:space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className="text-lg sm:text-xl font-bold">skills</h2>
                    <motion.div
                      className="flex flex-wrap gap-1.5 sm:gap-2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {[
                        'java',
                        'python',
                        'typescript',
                        'react',
                        'next.js',
                        'flutter',
                        'reverse engineering',
                        'ethical hacking',
                        'network security',
                      ].map(skill => (
                        <motion.span
                          key={skill}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(var(--primary), 0.2)' }}
                          className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs border border-primary/20 hover:border-primary/40 transition-all duration-300"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
