const express = require("express");
const router = express.Router();

// Socket IO connection
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

/**
 * This route renders the menu page.
 */
router.get("/menu", (req, res) => {
  res.render("menu", { owner: false, status: false });
});

/**
 * This route renders the status page.
 */
router.get("/status", (req, res) => {
  const order_id = req.session.order_id;
  if (order_id) {
    //   io.on("connection", (socket) => {
    //     console.log("Client connected");

    //     socket.on("get-data", (data) => {
    //       console.log(`Received data: ${data}`);

    //       // Replace this with your own code to get the data you need
    //       const responseData = { message: "Hello, client!" };

    //       socket.emit("data-response", responseData);
    //     });
    //   });

    const templateVar = { owner: false, status: true, order_id: order_id };
    res.render("status", templateVar);
  }
});

module.exports = router;
