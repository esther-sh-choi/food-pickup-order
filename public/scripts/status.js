let socket = io();
$(() => {
  // refreshEveryMinute();
  renderStatusPage();
});

/*
Sends an AJAX request to the server to fetch order data and renders it onto the page.
*/
const renderStatusPage = (timer = null) => {
  $.ajax({
    type: "GET",
    url: "/api/customer/status",
    success: (data) => {
      renderOrderData(data);
      socket.on("connect", () => {
        socket.on("hello", function () {
          console.log(arguments);
        });
      });
    },
  });
};

/*
Renders the customers order data on the screen and displays a message that gets updated throughout their order.
*/
const renderOrderData = (order, timer) => {
  const { estimated_ready_at, is_cancelled, is_complete, ready_at, orderId } =
    order;

  $(".order_info").empty();
  if (!estimated_ready_at) {
    $(".order_info").append(
      "Your order is pending. You will receive a text message with an estimated pickup time when the restaurant accepts your order."
    );
  } else {
    const date = new Date(estimated_ready_at);
    const localDateTime = date.toLocaleString();

    $(".order_info").append(`
    <p>Please come to pick up your order at:</p>
    <p>${localDateTime}</p>
    `);
  }

  if (ready_at && !is_complete) {
    $(".order_info").empty();
    $(".order_info").append("ORDER UP! Your order is ready for pickup!");
  }
  if (is_complete) {
    $(".order_info").empty();
    $(".order_info").append("Thank you for your order. Enjoy your meal!");
    // clearInterval(timer);
  }

  if (is_cancelled) {
    $(".order_info").empty();
    $(".order_info").append(
      "Sadly we need to cancel your order. Please try again, or call us with your Order ID for further details."
    );
  }
};

/*
In real production, I would use a websocket or change 1000 to 1000*60 so that it renders every minute rather than every second
*/
// const refreshEveryMinute = () => {
//   const timer = setInterval(() => {
//     renderStatusPage(timer);
//   }, 1000);
// };
