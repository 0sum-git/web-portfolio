'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
  { href: '/contact', label: 'contact' },
];

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <nav className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/">
              <motion.span
                className="font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                rodrigo ribeiro
              </motion.span>
            </Link>
          </motion.div>
          <div className="flex items-center space-x-8">
            {links.map(({ href, label }, i) => (
              <motion.div key={href} custom={i} variants={linkVariants}>
                <Link href={href}>
                  <motion.span
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${
                      pathname === href ? 'text-foreground' : 'text-muted'
                    } hover:text-foreground transition-colors`}
                  >
                    {label}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
