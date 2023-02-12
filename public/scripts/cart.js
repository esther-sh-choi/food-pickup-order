$(() => {
  $("#cart").on("click", cartClickHandler);
});

const cartClickHandler = () => {
  $(".cart-content").removeClass(".hide");
};
