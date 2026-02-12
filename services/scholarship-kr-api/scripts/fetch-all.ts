import { readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseDir = join(__dirname, 'scholarship-announcements');
const dirs = readdirSync(baseDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== 'template')
  .map(d => d.name);

console.log(`Found ${dirs.length} university scripts to run\n`);

let success = 0;
let failed = 0;

for (const dir of dirs) {
  const scriptPath = join(baseDir, dir, 'fetch.ts');
  const outputPath = join(baseDir, dir, 'announcements.json');
  
  if (!existsSync(scriptPath)) {
    console.log(`[SKIP] ${dir}: No fetch.ts found`);
    continue;
  }
  
  console.log(`[RUN] ${dir}...`);
  
  try {
    execSync(`bun run ${scriptPath}`, {
      cwd: join(__dirname, '..'),
      timeout: 60000,
      stdio: 'pipe'
    });
    
    if (existsSync(outputPath)) {
      console.log(`  ✓ Success: ${dir}`);
      success++;
    } else {
      console.log(`  ✗ Failed: No output file`);
      failed++;
    }
  } catch (e) {
    console.log(`  ✗ Failed: ${e.message}`);
    failed++;
  }
}

console.log(`\n========================================`);
console.log(`Results: ${success} succeeded, ${failed} failed`);
console.log(`========================================`);
