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
  console.log(`${name} joined, welcome! 🎉 `);
  //? Disconnect
  socket.on("disconnect", () => {
    console.log(`${name} left 😢`);
  });
  //? Wave
  socket.on("wave", () => {
    console.log(`${name} waved 👋 `);
  })
  //? Chat
  socket.on("chat", (msg) => {
    const time = new Date().toLocaleTimeString();
    console.log(
      `${name}(${time}): ${msg}
      `
    );
  });
});

server.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});
