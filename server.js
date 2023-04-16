const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  let name;
  let team;
  let time = new Date().toLocaleTimeString();
  // console.log(`(${time}) Unauthenticated user connected`);
  socket.emit("message","connection established, your Id is " + socket.id)
  //? Authentication
  socket.on("auth", (data) => {
    name = data.name;
    team = data.team;
    time = new Date().toLocaleTimeString();
    console.log(`(${time}) Auth success, ${name} from ${team} has joined 🎉`);
    socket.join(team);
  });
  //? Disconnect
  socket.on("disconnect", () => {
    time = new Date().toLocaleTimeString();
    if(name){
      console.log(`(${time}) ${name} from ${team} has left 😢`);
    }
  });
  //? Wave
  socket.on("wave", () => {
    time = new Date().toLocaleTimeString();
    console.log(`(${time}) ${name} waved 👋 `);
  })
  //? Global Chat
  socket.on("chat", (msg) => {
    time = new Date().toLocaleTimeString();
    console.log(
      `(${time}) [All] ${name}: "${msg}"`
    );
  });
  //? Room Chat
  socket.on("room-chat", (msg) => {
    time = new Date().toLocaleTimeString();
    console.log(
      `(${time}) [${team}] ${name}: "${msg}"`
    );
    socket.to(team).emit("room-chat", msg);
  });
  //? Move
  socket.on("move", (questionIndex) => {
    time = new Date().toLocaleTimeString();
    console.log(`(${time}) ${name} moved to question ${questionIndex}`);
    io.to(team).emit("move", { name, questionIndex });
  })
  //? Answer
  socket.on("answer", (answer) => {
    time = new Date().toLocaleTimeString();
    console.log(`(${time}) ${name} answered ${answer}`);
  });
});

server.listen(8080, () => {
  console.log("listening on http://localhost:8080");
});
