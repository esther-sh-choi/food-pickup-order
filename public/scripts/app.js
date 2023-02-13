$(() => {
  $("#landing-customer-button").on("click", (e) => {
    e.preventDefault();
    window.location.href = "/customer/menu";
  });
});
