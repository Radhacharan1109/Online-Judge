const express = require("express");
const app = express();
const cors = require("cors");
const { DBConnection } = require("./Databases/database");
const dotenv = require("dotenv");
const User = require("./Models/User.js");
const Problem = require("./Models/Problem.js");
const Submission=require("./Models/Submission.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Importing the authentication middleware
const authenticateToken = require("./middlewares/authMiddleware");

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

app.get("/", (req, res) => {
  res.json({ online: 'backend' });
});

// Authentication check 
app.get("/checkAuth", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

app.get("/checkAdmin", authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);
      // Check if the user exists and is an admin
      if (!user || !user.isAdmin) {
          return res.status(403).json({ message: "Unauthorized" });
      }
      res.status(200).json({ isAdmin: true });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
  }
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
      httpOnly: true, 
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

//USER PROFILE

app.put("/updateprofile", authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!(username && email)) {
      return res.status(400).send("Please enter all the information");
    }

    // Find the current user
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the username already exist
    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== req.user.id) {
      return res.status(409).json({ message: "Username already in use" });
    }

    // Check if the useremail already exist
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== req.user.id) {
      return res.status(409).json({ message: "Email already in use" });
    }    

    // Update the user's information in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, select: "-password -token -isAdmin" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new token with the updated user information
    const token = jwt.sign(
      { id: updatedUser._id, email: updatedUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Send the new token as a cookie
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options);

    // Return the updated user information
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/viewprofile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -token -isAdmin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/logout", (req, res) => {
  // Clear the token cookie by setting its expiration date to a past time
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.status(200).json({ message: "Logged out successfully" });
});

//SUBMISSIONS

app.post("/addSubmission", async (req, res) => {
  try {
    const { username, problemTitle, language, submissionTime } = req.body;

    const newSubmission = await Submission.create({
      username,
      problemTitle,
      language,
      submissionTime,
    });

    res.status(200).json({ message: "Submission added successfully", newSubmission });
  } catch (error) {
    console.error("Error adding submission:", error);
    res.status(500).json({ message: "Failed to add submission" });
  }
});

// Fetch all submissions
app.get("/getSubmissions", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Failed to fetch submissions" });
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
  Problem.find({}).select("-testcases")
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

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
