const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatTime = function (timeMs) {
  const seconds = Math.ceil(timeMs / 1000);
  const sec = seconds % 60;
  const min = Math.floor(seconds / 60);
  let res = '';

  if (min) res += `${min}m `;
  res += `${sec}s`;
  return res;
};

function generateWeightsFile(specWeights, totalDuration, totalWeight, weightJsonPath) {
  Object.keys(specWeights).forEach((spec) => {
    specWeights[spec].weight = Math.floor(
      (specWeights[spec].time / totalDuration) * totalWeight
    );
  });
  const weightsJson = JSON.stringify(specWeights);
  try {
    const filePath = path.join(process.cwd(), weightJsonPath);
    const dirPath = path.dirname(filePath);
    // create directory to avoid error if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true });
    // write parallel-weights.json file
    fs.writeFileSync(filePath, weightsJson, 'utf8');
    console.log('Weights file generated.');
  } catch (e) {
    console.error(e);
  }
}

function collectResults(resultsPath) {
  if (!fs.existsSync(resultsPath)) {
    return new Map();
  }
  const resultFiles = fs.readdirSync(resultsPath);
  const results = new Map();
  resultFiles.forEach((fileName) => {
    const filePath = path.join(resultsPath, fileName);
    const content = fs.readFileSync(filePath);
    const result = JSON.parse(content);
    results.set(result.file, result);
  });

  return results;
}

function makeThreadId() {
  const nouns = [
    'king',
    'disk',
    'hall',
    'lake',
    'math',
    'bird',
    'oven',
    'food',
    'love',
    'tale',
    'poem',
    'role',
    'fact',
    'user',
    'meal',
    'goal',
    'mall',
    'lady',
    'bath',
    'city',
    'mood',
    'exam',
    'menu',
    'year',
    'girl',
    'soup',
    'town'
  ];
  const adjectives = [
    'long',
    'wiry',
    'like',
    'fast',
    'tame',
    'good',
    'used',
    'flat',
    'slow',
    'lazy',
    'lewd',
    'cool',
    'hard',
    'sick',
    'damp',
    'tiny',
    'lean',
    'calm',
    'warm',
    'pale',
    'meek',
    'mere',
    'cold',
    'gray',
    'huge',
    'dark',
    'nice',
    'dizzy',
    'plain',
    'ditzy',
    'brave',
    'daily',
    'spicy',
    'rough',
    'thick',
    'super'
  ];
  const a1 = Math.round(Math.random() * adjectives.length);
  const n1 = Math.round(Math.random() * nouns.length);
  return `${adjectives[a1]}-${nouns[n1]}`;
}

module.exports = {
  collectResults,
  makeThreadId,
  sleep,
  formatTime,
  generateWeightsFile
};
