'use client';

import { Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { memo } from 'react';

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
    technologies?: string[]; // optional array of technologies to display as tags
  };
}

// animation variants for card
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

// reusable tag component to reduce repetition
const Tag = memo(({ children }: { children: React.ReactNode }) => (
  <motion.span
    className="tech-tag"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    {children}
  </motion.span>
));
Tag.displayName = 'Tag';

const ProjectCard = ({ project }: ProjectCardProps) => {
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
        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-0">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {/* First row - always for languages, always present even if empty */}
          <div className="tech-tags-container">
            {Object.entries(project.languages || {}).map(([lang]) => (
              <Tag key={lang}>{lang}</Tag>
            ))}
          </div>
          {/* Second row - always for topics, only present if there are topics */}
          {project.topics.length > 0 && (
            <div className="tech-tags-container">
              {project.topics.slice(0, 5).map((topic, index) => (
                <Tag key={index}>{topic}</Tag>
              ))}
              {project.topics.length > 5 && (
                <Tag>+{project.topics.length - 5}</Tag>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
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
};

// export memoized component to prevent unnecessary re-renders
export default memo(ProjectCard);
