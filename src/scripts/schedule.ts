import { exec } from 'child_process';
import path from 'path';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

function runFetchRepos(): void {
  const scriptPath = path.join(process.cwd(), 'src/scripts/fetchRepos.ts');
  exec(`ts-node ${scriptPath}`, (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`error running script: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// Executa imediatamente na primeira vez
runFetchRepos();

// Agenda para executar a cada 24 horas
setInterval(runFetchRepos, TWENTY_FOUR_HOURS);
