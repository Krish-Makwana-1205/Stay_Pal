// similarity-simple.js
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const fetch = require("node-fetch");
global.fetch = fetch;

let modelCache = null;

async function loadModel() {
  if (!modelCache) {
    modelCache = await use.load();
  }
  return modelCache;
}

function normalizeText(text) {
  if (!text) return "";
  return String(text).trim();
}

// Cosine similarity between two 2D tensors (1 x D)
function cosineFromTensors(aTensor, bTensor) {
  const dot = tf.sum(tf.mul(aTensor, bTensor)).dataSync()[0];
  const na = tf.norm(aTensor).dataSync()[0];
  const nb = tf.norm(bTensor).dataSync()[0];
  if (!na || !nb) return 0;
  return dot / (na * nb);
}

/**
 * getSimilarity(sentence1, sentence2)
 * Returns a number between 0 and 1
 */
async function getSimilaritySimple(sentence1, sentence2) {
  try {
    const text1 = normalizeText(sentence1);
    const text2 = normalizeText(sentence2);

    if (!text1.length || !text2.length) return 0;

    const model = await loadModel();
    const embeddings = await model.embed([text1, text2]);

    const emb1 = embeddings.slice([0, 0], [1, -1]);
    const emb2 = embeddings.slice([1, 0], [1, -1]);

    let sim = cosineFromTensors(emb1, emb2);

    // cleanup
    embeddings.dispose();
    emb1.dispose();
    emb2.dispose();

    // cosine can be [-1,1], map to [0,1]
    if (!Number.isFinite(sim)) return 0;
    const normalized = (sim + 1) / 2;
    return Math.max(0, Math.min(1, normalized));
  } catch (err) {
    console.error("Error in NLP similarity:", err);
    return 0;
  }
}

module.exports = { getSimilaritySimple };
