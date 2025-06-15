import { Octokit } from '@octokit/rest';
import { getProjectBySlug } from './github';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  baseUrl: 'https://api.github.com',
});

const CACHE_DIR = path.join(process.cwd(), 'src/data/cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

async function updateCache() {
  try {
    const repos = await octokit.repos.listForUser({
      username: process.env.GITHUB_USERNAME || '',
      sort: 'updated',
      direction: 'desc',
    });

    for (const repo of repos.data) {
      const project = await getProjectBySlug(repo.name);
      if (project) {
        const cacheFile = path.join(CACHE_DIR, `${repo.name}.json`);
        fs.writeFileSync(
          cacheFile,
          JSON.stringify(
            {
              timestamp: Date.now(),
              data: project,
            },
            null,
            2
          )
        );
      }
    }
  } catch (error) {
    console.error('Error updating cache:', error);
  }
}

updateCache();
setInterval(updateCache, 24 * 60 * 60 * 1000);
