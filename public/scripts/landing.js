$(() => {
  const $customerPageButton = $("main.landing-content").find("button");
  $customerPageButton.on("click", (e) => {
    e.preventDefault();
    window.location.href = "/customer/menu";
  });
});
