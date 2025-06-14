import { Octokit } from '@octokit/rest';

// Initialize Octokit with rate limiting and retries
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  timeZone: 'UTC',
  baseUrl: 'https://api.github.com',
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error,
  },
});

export interface Project {
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  readme: string;
  technologies: string[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    // Validate slug to prevent path traversal
    if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
      throw new Error('Invalid repository name');
    }

    const [repo, readme] = await Promise.all([
      octokit.repos.get({
        owner: process.env.GITHUB_USERNAME || '',
        repo: slug,
      }),
      octokit.repos.getReadme({
        owner: process.env.GITHUB_USERNAME || '',
        repo: slug,
      }),
    ]);

    const readmeContent = Buffer.from(readme.data.content, 'base64').toString();
    const technologies = extractTechnologies(readmeContent);

    return {
      name: repo.data.name,
      description: repo.data.description || '',
      html_url: repo.data.html_url,
      homepage: repo.data.homepage,
      readme: readmeContent,
      technologies,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

function extractTechnologies(readme: string): string[] {
  // Look for technologies section in README
  const techSection = readme.match(/## Technologies\n\n([\s\S]*?)(?=\n##|$)/i);
  if (!techSection) return [];

  return techSection[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- ') || line.startsWith('* '))
    .map(line => line.replace(/^[-*]\s*/, ''));
}
