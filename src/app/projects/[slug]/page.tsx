import { Github, ArrowLeft } from 'lucide-react';
import { Octokit } from '@octokit/rest';
import ProjectMarkdown from '@/components/ProjectMarkdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

const GITHUB_USERNAME = '0sum-git';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const CACHE_DIR = path.join(process.cwd(), 'src/data/cache');
const CACHE_DURATION = 24 * 60 * 60 * 1000;

if (!GITHUB_TOKEN) throw new Error('github_token is not defined');

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  timeZone: 'UTC',
  baseUrl: 'https://api.github.com',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error,
  },
});

interface CacheData {
  timestamp: number;
  data: ProjectData;
}

interface ProjectData {
  name: string;
  description: string | null;
  readme: string;
  stars: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  url: string;
}

interface OctokitError {
  status?: number;
  message?: string;
}

function getCachePath(slug: string): string {
  return path.join(CACHE_DIR, `${slug}.json`);
}

function isCacheValid(cachePath: string): boolean {
  if (!fs.existsSync(cachePath)) return false;
  const cache: CacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

function saveToCache(slug: string, data: ProjectData): void {
  const cachePath = getCachePath(slug);
  const cacheData: CacheData = { timestamp: Date.now(), data };
  fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
}

function getFromCache(slug: string): ProjectData | null {
  const cachePath = getCachePath(slug);
  if (!isCacheValid(cachePath)) return null;
  const cache: CacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  return cache.data;
}

async function getProject(slug: string): Promise<ProjectData> {
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) throw new Error('invalid repository name');

  try {
    const cachedData = getFromCache(slug);
    if (cachedData) return cachedData;

    const [repo, readme] = await Promise.all([
      octokit.repos.get({ owner: GITHUB_USERNAME, repo: slug }),
      octokit.repos
        .getReadme({ owner: GITHUB_USERNAME, repo: slug })
        .catch(() => ({ data: { content: '' } })),
    ]);

    const projectData: ProjectData = {
      name: repo.data.name,
      description: repo.data.description,
      readme: readme.data.content
        ? Buffer.from(readme.data.content, 'base64').toString()
        : 'no readme available',
      stars: repo.data.stargazers_count,
      language: repo.data.language,
      topics: repo.data.topics || [],
      updated_at: repo.data.updated_at,
      url: repo.data.html_url,
    };

    saveToCache(slug, projectData);
    return projectData;
  } catch (error: unknown) {
    const octokitError = error as OctokitError;
    if (octokitError?.status === 404) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `project: ${slug}` };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const project = await getProject(slug);

    return (
      <main className="min-h-screen bg-background text-foreground p-8 pt-32">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>back to projects</span>
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>view on github</span>
            </a>
          </div>

          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
            {project.description && (
              <p className="text-xl text-muted mb-8">{project.description}</p>
            )}

            <div className="flex flex-wrap gap-4 mb-8">
              {project.language && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {project.language}
                </span>
              )}
              {project.topics?.map((topic: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                ⭐ {project.stars} stars
              </span>
            </div>

            <div className="border-t border-border pt-8">
              <ProjectMarkdown content={project.readme} />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-background text-foreground p-8 pt-32">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">project not found</h1>
            <p className="text-muted">
              the project you are looking for does not exist or is not accessible
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mt-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>back to projects</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }
}

export const revalidate = 86400;
