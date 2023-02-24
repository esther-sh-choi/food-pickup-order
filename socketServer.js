const socketio = require("socket.io");
const cookieSession = require("cookie-session");

const listen = function (httpServer) {
  const server = socketio(httpServer);

  // server.on("connection", (socket) => {
  //   console.log("connected");
  //   socket.join(socket.request.session.order_id);
  // });

  // const wrap = (middleware) => (socket, next) =>
  //   middleware(socket.request, {}, next);

  // server.use(
  //   wrap(
  //     cookieSession({
  //       name: "session",
  //       keys: ["key1"],
  //     })
  //   )
  // );
  return server;
};

module.exports = { listen };
