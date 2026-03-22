const app             = require('./src/app');
const { startJobs }   = require('./src/jobs/segement.customer.job');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 RecyclaBag API running → http://localhost:${PORT}`);
  startJobs();
});