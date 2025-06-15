import { notFound } from 'next/navigation';
import { Octokit } from '@octokit/rest';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProjectMarkdown } from '@/components/ProjectMarkdown';
import { getFromCache, saveToCache } from '@/lib/cache';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

if (!GITHUB_USERNAME) throw new Error('GITHUB_USERNAME is not defined');
if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is not defined');

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  baseUrl: 'https://api.github.com',
});

interface OctokitError {
  status?: number;
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

async function getProject(slug: string): Promise<ProjectData> {
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) throw new Error('invalid repository name');

  try {
    const cachedData = getFromCache<ProjectData>(slug);
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
      <main className="min-h-screen bg-background text-foreground pt-16 md:pt-32 pb-16 md:pb-32">
        <div className="container mx-auto max-w-4xl px-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>back to projects</span>
          </Link>

          <div className="prose prose-invert max-w-none">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">{project.name}</h1>
            {project.description && (
              <p className="text-lg md:text-xl text-muted mb-6 md:mb-8">{project.description}</p>
            )}

            <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8">
              {project.language && (
                <span className="px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm">
                  {project.language}
                </span>
              )}
              {project.topics?.map((topic: string, index: number) => (
                <span
                  key={index}
                  className="px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm"
                >
                  {topic}
                </span>
              ))}
              <span className="px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm">
                ⭐ {project.stars} stars
              </span>
            </div>

            <div className="border-t border-border pt-6 md:pt-8">
              <ProjectMarkdown content={project.readme} />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-background text-foreground p-8 pt-16 md:pt-32">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">project not found</h1>
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
