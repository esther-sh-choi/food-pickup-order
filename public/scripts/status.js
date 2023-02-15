$(() => {
  $.ajax({
    type: "GET",
    url: "/api/customer/status",
    success: renderOrderData,
  });
});

const renderOrderData = (order) => {
  const {
    created_at,
    customer_id,
    estimated_ready_at,
    order_id,
    is_cancelled,
    is_complete,
    ready_at,
  } = order;

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
  }

  if (is_cancelled) {
    $(".order_info").empty();
    $(".order_info").append(
      "Sorry your order has been cancelled. Please contact the restaurant for details."
    );
  }

  // $(".order_info").append(order.);
};
