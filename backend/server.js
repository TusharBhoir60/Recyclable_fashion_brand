const app = require('./src/app');

function loadJobStarter() {
  const candidates = [
    './src/jobs/segment.customer.job',
  ];

  for (const modulePath of candidates) {
    try {
      const jobModule = require(modulePath);
      if (typeof jobModule.startJobs === 'function') {
        return jobModule.startJobs;
      }
    } catch (_err) {
      // Try the next candidate path.
    }
  }

  return null;
}

const startJobs = loadJobStarter();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 RecyclaBag API running → http://localhost:${PORT}`);

  if (startJobs) {
    try {
      startJobs();
    } catch (err) {
      console.error('[jobs] Failed to start scheduled jobs:', err.message);
    }
  } else {
    console.warn('[jobs] Scheduler module not found. Starting API without background jobs.');
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('[process] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[process] Uncaught exception:', err);
});