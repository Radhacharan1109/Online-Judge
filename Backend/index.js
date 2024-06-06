const express = require("express");
const app = express();
const cors = require("cors");
const { DBConnection } = require("./Databases/database");
const dotenv = require("dotenv");
const User = require("./Models/User.js");
const Problem = require("./Models/Problem.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
//compiler
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
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // This is important for sending cookies
  })
);

// Middleware to authenticate token

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/register", async (req, res) => {
  try {
    //get all the data from body
    const { username, email, password } = req.body;

    // check that all the data should exists
    if (!(username && email && password)) {
      return res.status(400).send("Please enter all the information");
    }

    // check if user already exists
    const existingUser = await User.findOne({ email }); //User is coming from file Models
    if (existingUser) {
      return res.status(200).send("User already exists!");
    }

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save the user in DB
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // generate a token for user and send it
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      //user._id is created automatically in mongodb when user is created
      expiresIn: "1d",
    });
    user.token = token;
    user.password = undefined;
    res
      .status(200)
      .json({ message: "You have successfully registered!", user });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    //get all the user data
    const { email, password } = req.body;

    // check that all the data should exists
    if (!(email && password)) {
      return res.status(400).send("Please enter all the information");
    }

    //find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found!");
    }

    //match the password
    const enteredPassword = await bcrypt.compare(password, user.password);
    if (!enteredPassword) {
      return res.status(404).send("Password is incorrect");
    }

    //generate a token for user and send it
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user.token = token;
    user.password = undefined;

    //store token cookies with options
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true, //only manipulate by server not by client/user
    };

    // send the token as a cookie
    res.cookie("token", token, options);

    //send the token in the response body
    res.status(200).json({
      message: "You have successfully logged in!",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//CRUD OPERATIONS For Problems

app.post("/createproblem", async (req, res) => {
  try {
    const { title, description, difficulty, testcases } = req.body;
    if (!(title && description && difficulty && testcases)) {
      return res.status(400).send("Please enter all the required information");
    }

    //testcases is received as a JSON string, parse it into an array
    const parsedTestcases = JSON.parse(testcases);

    const existingTitle = await Problem.findOne({ title });
    if (existingTitle) {
      return res.status(200).send("Title already exists!");
    }

    const newproblem = await Problem.create({
      title,
      description,
      difficulty,
      testcases: parsedTestcases,
    });
    res.status(200).json({
      message: "You have successfully created the problem!",
      newproblem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while creating the problem.");
  }
});

app.get("/readproblems", (req, res) => {
  Problem.find({})
    .then((problems) => res.json(problems))
    .catch((err) => res.json(err));
});

app.get("/getProblem/:id", (req, res) => {
  const id = req.params.id;
  Problem.findById({ _id: id })
    .then((problems) => res.json(problems))
    .catch((err) => res.json(err));
});

app.put("/updateProblem/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, difficulty, testcases } = req.body;

  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { title, description, difficulty, testcases },
      { new: true }
    );

    if (!updatedProblem) {
      return res.status(404).send("Problem not found");
    }

    res.json(updatedProblem);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while updating the problem.");
  }
});

app.delete("/deleteProblem/:id", (req, res) => {
  const id = req.params.id;

  Problem.findByIdAndDelete({ _id: id })
    .then((problems) => res.json(problems))
    .catch((err) => res.json(err));
});

//Compiler Part

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

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
