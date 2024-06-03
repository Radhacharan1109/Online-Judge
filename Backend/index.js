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
  generateCFile
} = require("./generateFile");
const { executeCpp, executeJava, executePython, executeC} = require("./executeCpp");

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
    //get all the problem data
    const { title, description, difficulty } = req.body;
    if (!(title && description && difficulty)) {
      return res.status(400).send("Please enter all the information");
    }

    // check if title already exists
    const existingTitle = await Problem.findOne({ title }); //problem is coming from file Models
    if (existingTitle) {
      return res.status(200).send("Title already exists!");
    }
    // save the problem in DB
    const newproblem = await Problem.create({
      title,
      description,
      difficulty,
    });
    res.status(200).json({
      message: "You have successfully created the problem!",
      newproblem,
    });
  } catch (error) {
    console.log(error);
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

app.put("/updateProblem/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, difficulty } = req.body;

  Problem.findByIdAndUpdate({ _id: id }, { title, description, difficulty })
    .then((problems) => res.json(problems))
    .catch((err) => res.json(err));
});

app.delete("/deleteProblem/:id", (req, res) => {
  const id = req.params.id;

  Problem.findByIdAndDelete({ _id: id })
    .then((problems) => res.json(problems))
    .catch((err) => res.json(err));
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }

  try {
    let filePath;
    let output;

    switch (language) {
      case "cpp":
        filePath = await generateCppFile(code);
        output = await executeCpp(filePath);
        break;
      case "java":
        filePath = await generateJavaFile(code);
        output = await executeJava(filePath);
        break;
      case "py":
        filePath = await generatePythonFile(code);
        output = await executePython(filePath);
        break;
      case "c":
        filePath = await generateCFile(code);
        output = await executeC(filePath);
        break;
      default:
        return res
          .status(400)
          .json({ success: false, error: "Unsupported language!" });
    }

    res.json({ filePath, output });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
