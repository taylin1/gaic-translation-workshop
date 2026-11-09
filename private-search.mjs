import { loadModel, ragIngest, ragSearch, ragCloseWorkspace, ragDeleteWorkspace, unloadModel, close, GTE_LARGE_FP16 } from '@qvac/sdk';

const notes = [
  'The training session starts at 5 pm in Room 2.',
  'Spare laptops are available in the training room. Ask the organiser to borrow one.',
  'Bring a notebook. The building closes at 7 pm.'
];
const question = process.argv.slice(2).join(' ') || 'Can I borrow a computer?';
const workspace = `gaic-workshop-${Date.now()}`;
let modelId;
let opened = false;

try {
  modelId = await loadModel({
    modelSrc: GTE_LARGE_FP16,
    onProgress: (p) => {
      if (process.stderr.isTTY) process.stderr.write(`\rDownload: ${Math.round(p.percentage ?? 0)}%   `);
    }
  });
  opened = true;
  await ragIngest({ modelId, documents: notes, workspace });
  const results = await ragSearch({ modelId, query: question, topK: 2, workspace });
  console.log(`\nQuestion: ${question}\n`);
  for (const item of results) console.log(`${item.score.toFixed(3)}  ${item.content}`);
  console.log('\nThese are matching notes, not a generated answer or a confidence percentage.');
} catch (error) {
  console.error(error.message ?? error);
  process.exitCode = 1;
} finally {
  try {
    if (opened) {
      await ragCloseWorkspace({ workspace });
      await ragDeleteWorkspace({ workspace });
    }
  } finally {
    try { if (modelId) await unloadModel({ modelId, clearStorage: false }); }
    finally { await close(); }
  }
}
