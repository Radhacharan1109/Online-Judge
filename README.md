# CodeLane-Online Judge

### OVERVIEW

CodeLane is a full stack online judge platform built using MERN stack (MongoDB, Express.js, React, Node.js).This platform aims to provide an environment where users can practice problems, enhance their coding skills and view how their code performs against series of custom testcases.

### Features

1. User authentication with JWT.
2. CRUD (create,read,update and delete) operations on problems and their respective testcases(only by admin). 
3. Profile view and edit.
4. Code compilation and execution using compiler.
5. Code submissions available for multiple languages.
6. Verdict on solution submitted by user.
7. Submission table which shows successful submissions of all users.

### Technologies Used

1. Frontend: React, Axios
2. Backend: Node.js, Express, MongoDB, Mongoose, Docker
3. Compiler: Node.js, Docker
4. Authentication: JWT (JSON Web Token)

### Prerequisites
1. Node.js and npm installed on your machine
2. Software development kits (SDK's) of C, C++, Java and Python installed on your machine
3. Docker installed
4. MongoDB Atlas account

## Installation

#### Clone the repository:

```git
git clone https://github.com/Radhacharan1109/Online-Judge.git
```
### Backend
#### Setup backend
```git
cd OnlineJudge/backend
```
#### Install dependencies:

```git
npm install
```

### Compiler
#### Setup compiler
```git
cd OnlineJudge/compiler
```
 #### Install dependencies:
 ```git
npm install
```

### Frontend
#### Setup frontend
```git
cd OnlineJudge/frontend
```
 #### Install dependencies:
 ```git
npm install
```

## Environment Variables
#### Create a .env file in the root of each repository and add the following variables:

#### Backend  
```
MONGO_URL=your_mongo_url
SECRET_KEY=your_jwt_secret_key
PORT=your_port_number_for_backend 
```

#### Compiler 
```
MONGO_URL=your_mongo_url
PORT=your_port_number_for_compiler
```

#### Frontend 
```
VITE_URL1=your_backend_url
VITE_URL2=your_frontend_url
```

## Running the Project
### Local Development
#### Backend
##### Start the backend server:

```git
nodemon index.js
```

#### Compiler
##### Start the compiler server:

```git
nodemon index.js
```

#### Frontend
##### Start the frontend server

```git
npm run dev
```

## Docker Deployment
#### Backend
```git
cd OnlineJudge/backend
docker build -t backend-image .
docker run -p <localhost>:<container> backend-image
```
#### Compiler
```git
cd OnlineJudge/compiler
docker build -t compiler-image .
docker run -p <localhost>:<container> compiler-image
```
