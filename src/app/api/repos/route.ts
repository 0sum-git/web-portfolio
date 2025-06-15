import { NextResponse } from 'next/server';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

const projectTechnologies: Record<string, string[]> = {
  portfolio: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Node.js'],
  'crypto-tracker': ['React', 'TypeScript', 'Tailwind CSS', 'CoinGecko API'],
  'weather-app': ['React', 'TypeScript', 'OpenWeather API', 'Tailwind CSS'],
  'todo-app': ['React', 'TypeScript', 'Tailwind CSS', 'LocalStorage'],
  'chat-app': ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
  blog: ['Next.js', 'TypeScript', 'MDX', 'Tailwind CSS'],
  ecommerce: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS', 'Prisma'],
  dashboard: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
};

export const revalidate = 3600;

export async function GET() {
  if (!GITHUB_USERNAME) {
    return NextResponse.json({ error: 'GitHub username not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();

    const repos = data.map((repo: GitHubRepo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: projectTechnologies[repo.name] || repo.topics || [],
      updated_at: repo.updated_at,
    }));

    return NextResponse.json(repos);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}
