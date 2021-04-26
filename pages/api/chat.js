import { Server } from "socket.io";

// Because NextJS doesn't officially support websockets, need to deploy using heroku
// This solution is by rogeriojlle on StackOverflow:
// https://stackoverflow.com/questions/57512366/how-to-use-socket-io-with-next-js-api-routes/62547135#62547135
const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("first use, starting socket.io");

    //create a websocket server
    const io = new Server(res.socket.server);

    // when a message is submitted, broadcast it
    io.on("connection", (socket) => {
      // echo msg to user
      socket.on("message-submitted", (msg) => {
        socket.emit("message", msg);
        // broadcast to everyone else
        socket.broadcast.emit("message", msg);
      });
    });

    // make the socket available externally

    res.socket.server.io = io;
  } else {
    // if already started sever, dont do anything
    console.log("Server already started");
  }

  //send back an empty 200
  res.end();
};

export default ioHandler;
