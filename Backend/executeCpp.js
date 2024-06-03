const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Function to create subdirectories for each language
const createLanguageOutputDir = (language) => {
    const langDir = path.join(outputPath, language);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir);
    }
    return langDir;
  };

const executeCpp = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outDir = createLanguageOutputDir('cpp');
  const outPath = path.join(outDir, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const command = `g++ "${filePath}" -o "${outPath}" && cd "${outDir}" && .\\${jobId}.exe`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

const executeJava = (filePath) => {
  return new Promise((resolve, reject) => {
    const runCommand = `java "${filePath}"`;
    exec(runCommand, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

const executePython = (filePath) => {
  return new Promise((resolve, reject) => {
    const command = `python "${filePath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

const executeC = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outDir = createLanguageOutputDir('c');
  const outPath = path.join(outDir, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const command = `gcc "${filePath}" -o "${outPath}" && cd "${outDir}" && .\\${jobId}.exe`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

module.exports = {
  executeCpp,
  executeJava,
  executePython,
  executeC,
};
