'use client';

import ProjectCard from '@/components/ProjectCard';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GithubRepo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export default function ProjectsPage() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch('/api/repos');
        if (!res.ok) throw new Error(`github api error: ${res.status}`);
        const data = await res.json();
        setRepos(data);
      } catch (error) {
        console.error('error fetching repositories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-background text-foreground pt-32">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="text-center">
              <p className="text-muted">loading projects...</p>
            </div>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground pt-32 pb-32">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">projects</h1>
            <p className="text-muted max-w-2xl mt-3">
              a collection of my open source projects and contributions
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {repos.map((repo, index) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={repo} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
