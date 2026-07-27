import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 1. Read package.json version
const packageJsonPath = path.resolve('package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version || '1.0.0';

// 2. Format current date as MMDDYYYY
const now = new Date();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const yyyy = now.getFullYear();
const dateStr = `${mm}${dd}${yyyy}`; // e.g. 07272026

// 3. Construct target name: ProjectName_MMDDYYYY_vVersion
const projectName = 'FirstGate_AI';
const archiveName = `${projectName}_${dateStr}_v${version}.zip`;
const archivePath = path.resolve(archiveName);

console.log(`[Export Pipeline] Building Vite production assets...`);
execSync('npx vite build', { stdio: 'inherit' });

console.log(`[Export Pipeline] Packing 'out' directory into '${archiveName}'...`);

try {
  if (process.platform === 'win32') {
    const psCommand = `powershell -Command "Compress-Archive -Path out\\* -DestinationPath '${archiveName}' -Force"`;
    execSync(psCommand, { stdio: 'inherit' });
  } else {
    // Linux / macOS fallback using standard zip utility
    execSync(`zip -r '${archiveName}' out/*`, { stdio: 'inherit' });
  }

  console.log(`\n==================================================`);
  console.log(`✅ EXPORT SUCCESSFUL!`);
  console.log(`📦 Output File: ${archiveName}`);
  console.log(`📁 File Path:   ${archivePath}`);
  console.log(`==================================================\n`);
} catch (err) {
  console.warn(`[Export Pipeline Warning] Automatic zip compression skipped or failed: ${err.message}`);
  console.log(`📁 'out' directory is still ready for deployment.`);
}
