'use client';

import ProjectCard from '@/components/ProjectCard';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  files: MarkdownFile[];
  technologies?: string[];
}

interface MarkdownFile {
  id: string;
  filename: string;
  content: string;
  createdAt: string;
  projectId: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error(`api error: ${res.status}`);
        const data = await res.json();
        setProjects(data);
        setError(null);
      } catch (error) {
        setError('failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-background text-foreground pt-16 md:pt-32">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="text-center" aria-live="polite" role="status">
              <p className="text-muted">loading projects...</p>
            </div>
          </div>
        </main>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-background text-foreground pt-16 md:pt-32">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="text-center" aria-live="assertive" role="alert">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">projects</h1>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground pt-16 md:pt-32 pb-16 md:pb-32">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">projects</h1>
            <p className="text-muted max-w-2xl mt-2 md:mt-3">
              a collection of my projects
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {projects.map((project, index) => {
              const adaptedProject = {
                name: project.title,
                description: project.description,
                stars: 0,
                language: null,
                languages: {},
                topics: [],
                updated_at: project.createdAt,
                technologies: project.technologies || [],
              };
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a 
                    href={`/projects/${encodeURIComponent(project.title)}`} 
                    style={{ display: 'block', height: '100%' }}
                    aria-label={`View details for project ${project.title}`}
                  >
                    <ProjectCard project={adaptedProject} />
                  </a>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
