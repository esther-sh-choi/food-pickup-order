$(() => {
  refreshEveryMinute();
});

const renderStatusPage = (timer) => {
  $.ajax({
    type: "GET",
    url: "/api/customer/status",
    success: (data) => {
      renderOrderData(data, timer);
    },
  });
};

const renderOrderData = (order, timer) => {
  const { estimated_ready_at, is_cancelled, is_complete, ready_at } = order;

  $(".order_info").empty();
  if (!estimated_ready_at) {
    $(".order_info").append("Order pending.");
  } else {
    $(".order_info").append(`
    <p>Time remaining until pickup</p>
    <p>${estimated_ready_at}</p>
    `);
  }

  if (ready_at && !is_complete) {
    $(".order_info").empty();
    $(".order_info").append("Your order is ready for pickup!");
  }
  if (is_complete) {
    $(".order_info").empty();
    $(".order_info").append("Thank you for your order. Enjoy your meal!");
    clearInterval(timer);
  }

  if (is_cancelled) {
    $(".order_info").empty();
    $(".order_info").append(
      "Sorry your order has been cancelled. Please contact the restaurant for details."
    );
  }
};

// In real production, I would use a websocket or change 1000 to 1000*60 so that it renders every minute rather than every second
const refreshEveryMinute = () => {
  const timer = setInterval(() => {
    renderStatusPage(timer);
  }, 1000);
};
