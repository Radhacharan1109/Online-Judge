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

const executeCpp = (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outDir = createLanguageOutputDir('cpp');
  const outPath = path.join(outDir, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    //changing the command because docker environment is unix like
    const command = `g++ "${filePath}" -o "${outPath}" && cd "${outDir}" && ./${jobId}.exe < "${inputPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message); // Return stderr if available, otherwise error.message
      } else {
        resolve(stdout);
      }
    });
  });
};

const executeJava = (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    const runCommand = `java "${filePath}" < "${inputPath}"`;
    exec(runCommand, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};

const executePython = (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    const command = `python "${filePath}" < "${inputPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};

const executeC = (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outDir = createLanguageOutputDir('c');
  const outPath = path.join(outDir, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    //changing the command because docker environment is unix like
    const command = `gcc "${filePath}" -o "${outPath}" && cd "${outDir}" && ./${jobId}.exe < "${inputPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};

module.exports = {
  executeCpp,
  executeJava,
  executePython,
  executeC,
};
