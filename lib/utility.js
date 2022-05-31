const fs = require('fs');
const path = require('path');

const { settings } = require('./settings');

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

function generateWeightsFile(specWeights, totalDuration, totalWeight) {
  Object.keys(specWeights).forEach((spec) => {
    specWeights[spec].weight = Math.floor(
      (specWeights[spec].time / totalDuration) * totalWeight
    );
  });
  const weightsJson = JSON.stringify(specWeights);
  try {
    const filePath = path.join(process.cwd(), settings.weightsJSON);
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

module.exports = {
  collectResults,
  sleep,
  formatTime,
  generateWeightsFile
};
