import { loadModel, translate, unloadModel, close, BERGAMOT_EN_FR } from '@qvac/sdk';

const text = process.argv.slice(2).join(' ') ||
  'The meeting starts at 5 pm.';
let modelId;

try {
  modelId = await loadModel({
    modelSrc: BERGAMOT_EN_FR,
    modelConfig: { engine: 'Bergamot', from: 'en', to: 'fr' },
    onProgress: (p) => {
      if (process.stderr.isTTY) process.stderr.write(`\rDownload: ${Math.round(p.percentage ?? 0)}%   `);
    }
  });
  const started = performance.now();
  const result = translate({ modelId, text, modelType: 'nmtcpp-translation', stream: false });
  const translated = await result.text;
  console.log(`\nEnglish: ${text}\nFrench:  ${translated}`);
  console.log(`Translation request: ${Math.round(performance.now() - started)} ms`);
} catch (error) {
  console.error(error.message ?? error);
  process.exitCode = 1;
} finally {
  try { if (modelId) await unloadModel({ modelId, clearStorage: false }); }
  finally { await close(); }
}
