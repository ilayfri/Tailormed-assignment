const mongoose = require("mongoose");
const express = require("express");
const Program = require("./models/Program");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const ScarptingRequests = require("./routes/Scrapting.js");

const server = http.createServer(app);
const ProgramsEventEmitter = Program.watch();
const io = socketIo(server, { cors: { origin: "*" } });
const port = process.env.PORT || 4001;

// set connection to DB
console.log("[set a connection for DB..]");
mongoose
  .connect(
    "mongodb+srv://ilay:ilayfRi140!@cluster0.rifg5.mongodb.net/DB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((res) => {
    console.log("[DB connected!]");
    let interval;
    
    // create socket
    io.on("connection", (socket) => {
      console.log(`New client connected [id: ${socket.id}]`);

      ProgramsEventEmitter.on("change", (change) => {
        socket.emit("dbUpdate", change);
      });
      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => {
        ScarptingRequests.webCheck();
      }, 500);

      socket.on("requestDBData", async () => {
        return await Program.find({}).then((res) => {
          socket.emit("sendDBData", res);
        });
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected [id: ${socket.id}] `);
      });
    });

    server.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch((err) => {
    console.log(err);
  });
