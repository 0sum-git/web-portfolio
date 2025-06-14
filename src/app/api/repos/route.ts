import { NextResponse } from 'next/server';

const GITHUB_USERNAME = '0sum-git';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

const additionalTechs: Record<string, string[]> = {
  portfolio: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Node.js'],
  'crypto-tracker': ['React', 'TypeScript', 'Tailwind CSS', 'CoinGecko API'],
  'weather-app': ['React', 'TypeScript', 'OpenWeather API', 'Tailwind CSS'],
  'todo-app': ['React', 'TypeScript', 'Tailwind CSS', 'LocalStorage'],
  'chat-app': ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
  blog: ['Next.js', 'TypeScript', 'MDX', 'Tailwind CSS'],
  ecommerce: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS', 'Prisma'],
  dashboard: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
  'auth-system': ['Next.js', 'TypeScript', 'NextAuth.js', 'Prisma'],
  'api-gateway': ['Node.js', 'TypeScript', 'Express', 'Docker'],
};

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'nextjs-app',
      },
    });

    if (!res.ok) {
      throw new Error(`github api error: ${res.status}`);
    }

    const data = await res.json();
    const repos = data.map((repo: GitHubRepo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      updated_at: repo.updated_at,
      topics: [...(repo.topics || []), ...(additionalTechs[repo.name] || [])],
    }));

    return NextResponse.json(repos);
  } catch (error: unknown) {
    console.error('error fetching repositories:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}
