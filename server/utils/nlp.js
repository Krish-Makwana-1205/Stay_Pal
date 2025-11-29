// similarity-negation-exclusive.js
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const fetch = require("node-fetch");
global.fetch = fetch;

let modelCache = null;
async function loadModel() {
  if (!modelCache) modelCache = await use.load();
  return modelCache;
}

function tokenize(s) {
  return String(s || "")
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
}

function tokenOverlapScore(targetTokens, candidateTokens) {
  if (!targetTokens.length) return 0;
  const candSet = new Set(candidateTokens);
  let match = 0;
  for (const t of targetTokens) if (candSet.has(t)) match++;
  return match / targetTokens.length;
}

function cosineFromTensors(aTensor, bTensor) {
  const dot = tf.sum(tf.mul(aTensor, bTensor)).dataSync()[0];
  const na = tf.norm(aTensor).dataSync()[0];
  const nb = tf.norm(bTensor).dataSync()[0];
  return dot / (na * nb);
}

function extractNegatedTarget(text) {
  const negRegex = /\b(?:not|no|never|don't|dont|do not|avoid|without|lack of)\b\s*(.*)/i;
  const m = text.match(negRegex);
  if (!m) return null;
  // take up to first punctuation or end
  return m[1].split(/[.,;?!]/)[0].trim();
}

function extractExclusiveTarget(text) {
  // patterns like "only X", "X only", "only want X", "prefer only X", "must be X", "just X" (careful)
  // prefer more explicit patterns first
  const patterns = [
    /\bonly\s+(?:want\s+)?(.+)/i,
    /\bprefer\s+(?:only\s+)?(.+)/i,
    /\bmust\s+be\s+(.+)/i,
    /\bjust\s+(?:want\s+)?(.+)/i,
    /(.+?)\s+only\b/i,
    /\bexclusive(?:ly)?\s+(?:want\s+)?(.+)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) {
      return m[1].split(/[.,;?!]/)[0].trim();
    }
  }
  return null;
}

async function getSimilarity(sentence1, sentence2) {
  try {
    if (!sentence1 || !sentence2) return 0;
    const text1 = String(sentence1).trim();
    const text2 = String(sentence2).trim();
    if (!text1.length || !text2.length) return 0;

    const hasNegation = /\b(no|not|never|don't|dont|do not|avoid|without|lack of)\b/i.test(text1);
    const negatedTargetRaw = extractNegatedTarget(text1); // e.g. "a house near metro"
    console.log(negatedTargetRaw);
    const exclusiveTargetRaw = extractExclusiveTarget(text1); // e.g. "apartment near park only"

    const model = await loadModel();
    const embeddings = await model.embed([text1, text2]);
    const emb1 = embeddings.slice([0, 0], [1, -1]);
    const emb2 = embeddings.slice([1, 0], [1, -1]);

    let sim = cosineFromTensors(emb1, emb2);

    // Exclusive preference handling: if user said "only X" or similar,
    // require that sentence2 sufficiently matches the exclusive target.
    if (exclusiveTargetRaw) {
      const exTokens = tokenize(exclusiveTargetRaw);
      const s2Tokens = tokenize(text2);
      const overlap = tokenOverlapScore(exTokens, s2Tokens);
      const requiredOverlap = Math.min(0.6, 1 - 1 / Math.max(exTokens.length, 4)); // heuristic
      if (overlap < requiredOverlap) {
        // sentence2 does not satisfy exclusive preference -> force low similarity
        embeddings.dispose();
        emb1.dispose();
        emb2.dispose();
        return 0;
      }
      // otherwise, sentence2 matches exclusive target; keep sim as-is (or slightly boost)
    }

    // Negation handling: if sentence1 negates something and sentence2 contains that target,
    // invert similarity (so similar content receives low final score)
    if (hasNegation && negatedTargetRaw) {
      const negTokens = tokenize(negatedTargetRaw);
      const s2Tokens = tokenize(text2);
      const overlap = tokenOverlapScore(negTokens, s2Tokens);
      if (overlap >= 0.25) {
        sim = 0.5 - sim;
      }
    } else if (hasNegation && !negatedTargetRaw) {
      // If negation present but we could not extract explicit target,
      // be conservative: if sentence2 shares many tokens with sentence1, invert.
      const s1Tokens = tokenize(text1);
      const s2Tokens = tokenize(text2);
      const overlap = tokenOverlapScore(s1Tokens, s2Tokens);
      if (overlap >= 0.6) sim = 1 - sim;
    }

    embeddings.dispose();
    emb1.dispose();
    emb2.dispose();

    // clamp to [0,1]
    if (!Number.isFinite(sim)) return 0;
    if (sim > 1) sim = 1;
    return sim;
  } catch (err) {
    console.error("Error in NLP similarity:", err);
    return 0;
  }
}

module.exports = { getSimilarity };
