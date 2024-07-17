import { Worker, QueueEvents } from 'bullmq';
import { generatePageContent } from './tasks.js';



const connection = {
  host: 'localhost',
  port: process.env.REDIS_PORT || 6379
};

const worker = new Worker('storyQueue', async job => {
  await generatePageContent(job);
}, {
  connection,
  settings: {
    retryProcessDelay: 5000
  }
});


worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error ${err.message}`);
});

const queueEvents = new QueueEvents('storyQueue', { connection });

queueEvents.on('completed', (jobId) => {
  console.log(`Job ${jobId} completed`);
});

queueEvents.on('failed', (jobId, failedReason) => {
  console.error(`Job ${jobId} failed with reason ${failedReason}`);
});
