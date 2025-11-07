const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const fetch = require('node-fetch');
global.fetch = fetch;

// Cache the model to avoid reloading it on every call
let modelCache = null;

async function loadModel() {
  if (!modelCache) {
    modelCache = await use.load();
  }
  return modelCache;
}

async function getSimilarity(sentence1, sentence2) {
  try {
    // Validate inputs - this is the key fix for your error
    if (!sentence1 || !sentence2) {
      console.warn('One or both sentences are undefined/null:', { sentence1, sentence2 });
      return 0; // Return 0 similarity for invalid inputs
    }

    // Ensure inputs are strings and not empty
    const text1 = String(sentence1).trim();
    const text2 = String(sentence2).trim();

    if (text1.length === 0 || text2.length === 0) {
      console.warn('One or both sentences are empty after trimming');
      return 0;
    }

    const model = await loadModel();
    
    // Embed both sentences
    const embeddings = await model.embed([text1, text2]);
    
    // Split the embeddings
    const embedding1 = embeddings.slice([0, 0], [1, -1]);
    const embedding2 = embeddings.slice([1, 0], [1, -1]);

    // Calculate cosine similarity
    const dotProduct = tf.sum(tf.mul(embedding1, embedding2)).dataSync()[0];
    const norm1 = tf.norm(embedding1).dataSync()[0];
    const norm2 = tf.norm(embedding2).dataSync()[0];
    const cosineSimilarity = dotProduct / (norm1 * norm2);

    // Clean up tensors to prevent memory leaks
    embeddings.dispose();
    embedding1.dispose();
    embedding2.dispose();

    console.log(`Similarity between "${text1.substring(0, 50)}..." and "${text2.substring(0, 50)}...": ${cosineSimilarity}`);
    return cosineSimilarity;
  } catch (err) {
    console.error("Error in NLP similarity:", err);
    return 0; // Return 0 on error instead of undefined
  }
}

module.exports = {
  getSimilarity
}