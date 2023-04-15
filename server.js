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
  const name = socket.handshake.query.name;
  console.log(`${name} connected`);
  //? Disconnect
  socket.on("disconnect", () => {
    console.log(`${name} disconnected`);
  });
  //? Wave
  socket.on("wave", (name) => {
    console.log(`${name} waved 👋 `);
  })
});

server.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});
