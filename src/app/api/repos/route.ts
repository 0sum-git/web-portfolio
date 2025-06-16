import { NextResponse } from 'next/server';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  topics?: string[];
  updated_at: string;
}

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

    const repos = await Promise.all(
      data.map(async (repo: GithubRepo) => {
        // Buscar informações detalhadas das linguagens
        const languagesRes = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/languages`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              ...(process.env.GITHUB_TOKEN && {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              }),
            },
          }
        );

        let languages = {};
        if (languagesRes.ok) {
          const languagesData = await languagesRes.json() as Record<string, number>;
          const total = Object.values(languagesData).reduce((a: number, b: number) => a + b, 0);
          languages = Object.entries(languagesData).reduce((acc, [lang, bytes]) => {
            acc[lang] = (bytes / total) * 100;
            return acc;
          }, {} as Record<string, number>);
        }

        return {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          language: repo.language,
          languages,
          topics: repo.topics || [],
          updated_at: repo.updated_at,
        };
      })
    );

    return NextResponse.json(repos);
  } catch (error: unknown) {
    console.error('Error fetching repos:', error);
    return NextResponse.json({ error: 'Failed to fetch repos' }, { status: 500 });
  }
}
