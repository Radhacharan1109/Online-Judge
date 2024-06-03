const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

// Function to create subdirectories for each language
const createLanguageDir = (language) => {
  const langDir = path.join(dirCodes, language);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir);
  }
  return langDir;
};

const generateCppFile = async (code) => {
  const jobID = uuid();
  const filename = `${jobID}.cpp`;
  const filePath = path.join(createLanguageDir('cpp'), filename);
  fs.writeFileSync(filePath, code);
  return filePath;
};

const generateJavaFile = async (code) => {
  const jobID = uuid();
  const filename = `${jobID}.java`;
  const filePath = path.join(createLanguageDir('java'), filename);
  fs.writeFileSync(filePath, code);
  return filePath;
};

const generatePythonFile = async (code) => {
  const jobID = uuid();
  const filename = `${jobID}.py`;
  const filePath = path.join(createLanguageDir('python'), filename);
  fs.writeFileSync(filePath, code);
  return filePath;
};

const generateCFile = async (code) => {
  const jobID = uuid();
  const filename = `${jobID}.c`;
  const filePath = path.join(createLanguageDir('c'), filename);
  fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = {
  generateCppFile,
  generateJavaFile,
  generatePythonFile,
  generateCFile,
};

