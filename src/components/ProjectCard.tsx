'use client';

import { Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: {
    name: string;
    description: string | null;
    stars: number;
    language: string | null;
    languages: {
      [key: string]: number;
    };
    topics: string[];
    updated_at: string;
  };
}

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/projects/${project.name}`);
  };

  return (
    <motion.div
      className="project-card hover:border-foreground transition-colors cursor-pointer"
      onClick={handleClick}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <div className="project-card-header">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Github className="w-12 h-12 text-muted" />
        </motion.div>
      </div>
      <div className="project-card-content">
        <h2 className="text-xl font-bold">{project.name}</h2>
        <p className="text-muted line-clamp-3">{project.description || 'no description'}</p>
        <div className="flex flex-col gap-2">
          <div className="tech-tags-container">
            {Object.entries(project.languages || {}).map(([lang]) => (
              <motion.span
                key={lang}
                className="tech-tag"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {lang}
              </motion.span>
            ))}
          </div>
          <div className="tech-tags-container">
            {project.topics.slice(0, 5).map((topic, index) => (
              <motion.span
                key={index}
                className="tech-tag"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {topic}
              </motion.span>
            ))}
            {project.topics.length > 5 && (
              <motion.span
                className="tech-tag"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                +{project.topics.length - 5}
              </motion.span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="stars-tag">⭐ {project.stars}</div>
          <div className="text-sm text-muted">
            last updated:{' '}
            {new Date(project.updated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
