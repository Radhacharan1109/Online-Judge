const express = require("express");
const app = express();
const cors = require("cors");
const { DBConnection } = require("./Databases/database");
const dotenv = require("dotenv");
const Problem = require("./Models/Problem.js");
//compiler
// Output comparison function for verdict
const { compareOutputs } = require("./compare");

const {
  generateCppFile,
  generateJavaFile,
  generatePythonFile,
  generateCFile,
} = require("./generateFile");

const { generateInputFile } = require("./generateInputFile");

const {
  executeCpp,
  executeJava,
  executePython,
  executeC,
} = require("./executeFile");

dotenv.config();
DBConnection();

//middlewares as by default server wont recognise the type of data we are sending
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // This is important for sending cookies
  })
);

//Compiler Part

app.get("/", (req, res) => {
  res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }

  try {
    let filePath;
    let inputPath;
    let output;

    switch (language) {
      case "cpp":
        filePath = await generateCppFile(code);
        inputPath = await generateInputFile(input);
        output = await executeCpp(filePath, inputPath);
        break;
      case "java":
        filePath = await generateJavaFile(code);
        inputPath = await generateInputFile(input);
        output = await executeJava(filePath, inputPath);
        break;
      case "py":
        filePath = await generatePythonFile(code);
        inputPath = await generateInputFile(input);
        output = await executePython(filePath, inputPath);
        break;
      case "c":
        filePath = await generateCFile(code);
        inputPath = await generateInputFile(input);
        output = await executeC(filePath, inputPath);
        break;
      default:
        return res
          .status(400)
          .json({ success: false, error: "Unsupported language!" });
    }

    res.json({ filePath, inputPath, output });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

app.post('/verdict/:id', async (req, res) => {
  try {
    const { code, language } = req.body;
    const problemId = req.params.id;

    console.log('Received request:', { code, language, problemId });

    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required!' });
    }

    const problem = await Problem.findById({_id:problemId});

    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found!' });
    }

    console.log('Retrieved problem:', problem);

    const testResults = [];
    let overallVerdict = true;

    for (const testcase of problem.testcases) {
      const { input, output: expectedOutput } = testcase;
      console.log('Processing testcase:', testcase);

      const inputFilePath = await generateInputFile(input);
      let generatedOutput;

      try {
        let sourceFilePath;
        switch (language) {
          case 'cpp':
            sourceFilePath = await generateCppFile(code);
            generatedOutput = await executeCpp(sourceFilePath, inputFilePath);
            break;
          case 'java':
            sourceFilePath = await generateJavaFile(code);
            generatedOutput = await executeJava(sourceFilePath, inputFilePath);
            break;
          case 'py':
            sourceFilePath = await generatePythonFile(code);
            generatedOutput = await executePython(sourceFilePath, inputFilePath);
            break;
          case 'c':
            sourceFilePath = await generateCFile(code);
            generatedOutput = await executeC(sourceFilePath, inputFilePath);
            break;
          default:
            return res.status(400).json({ success: false, error: 'Unsupported language!' });
        }

        console.log('Generated output:', generatedOutput);

        const isCorrect = await compareOutputs(generatedOutput, expectedOutput);
        console.log('Comparison result:', isCorrect);

        testResults.push({ input, expectedOutput, generatedOutput, isCorrect });

        if (!isCorrect) {
          overallVerdict = false;
          break;
        }
      } catch (error) {
        console.error('Error executing code:', error);
        return res.status(500).json({ success: false, error: error.message });
      } 
    }
    res.json({ success: true, overallVerdict, testResults });
  } catch (error) {
    console.error('Error processing verdict:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
