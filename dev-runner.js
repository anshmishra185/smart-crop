import { spawn, exec } from 'node:child_process';

console.log('\x1b[32m%s\x1b[0m', '============================================================');
console.log('\x1b[32m%s\x1b[0m', ' 🌾 STARTING KRISHI SAARTHI FULL-STACK APPLICATION');
console.log('\x1b[32m%s\x1b[0m', ' -> Backend:  http://127.0.0.1:8000 (Swagger: /docs)');
console.log('\x1b[32m%s\x1b[0m', ' -> Frontend: http://localhost:5173');
console.log('\x1b[32m%s\x1b[0m', '============================================================\n');

const isWin = process.platform === 'win32';

// 1. Spawn Python Backend
const backend = spawn('python run_backend.py', {
  stdio: 'inherit',
  shell: true,
});

// 2. Spawn Vite Frontend
const frontend = spawn('npx vite', {
  stdio: 'inherit',
  shell: true,
});

function terminateProcess(proc) {
  if (!proc || !proc.pid) return;
  try {
    if (isWin) {
      exec(`taskkill /PID ${proc.pid} /T /F`, () => {});
    } else {
      proc.kill('SIGTERM');
    }
  } catch {
    // Ignore cleanup errors
  }
}

let cleanedUp = false;
function shutdown() {
  if (cleanedUp) return;
  cleanedUp = true;
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Shutting down Krishi Saarthi Full-Stack services...');
  terminateProcess(backend);
  terminateProcess(frontend);
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

backend.on('exit', (code) => {
  if (code !== 0 && !cleanedUp) {
    console.error(`\x1b[31mBackend process exited with code ${code}\x1b[0m`);
  }
});

frontend.on('exit', (code) => {
  if (code !== 0 && !cleanedUp) {
    console.error(`\x1b[31mFrontend process exited with code ${code}\x1b[0m`);
  }
});
