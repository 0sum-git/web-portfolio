'use client';

import { Terminal, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

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
  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground relative">
        <div className="relative z-10">
          <div className="container mx-auto px-4 pt-32">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Terminal className="w-12 h-12 mb-6" />
                </motion.div>
                <h1 className="text-5xl font-bold mb-4 tracking-tight">
                  cybersecurity &
                  <br />
                  software developer
                </h1>
                <p className="text-lg text-muted mb-8">
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
                className="mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-2xl font-bold mb-2">hi, i&apos;m rodrigo</p>
                <p className="text-lg text-muted mb-8">and welcome to my portfolio</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-2xl font-bold">about me</h2>
                    <p className="text-muted">
                      i&apos;m a recent graduate in cybersecurity who loves software engineering and
                      cybersecurity projects. i&apos;m passionate about creating secure and
                      innovative software solutions. always eager to explore new technologies and
                      tackle challenging projects.
                    </p>
                  </motion.div>
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className="text-2xl font-bold">skills</h2>
                    <motion.div
                      className="flex flex-wrap gap-3"
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
                          className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 hover:border-primary/40 transition-all duration-300"
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
