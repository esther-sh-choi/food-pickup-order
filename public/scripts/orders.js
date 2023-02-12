$(() => {
  $(".tabs").tabs();

  const modalMessages = {
    add: "Are you sure you want to set the prep time?",
    cancel: "Are you sure you want to cancel the order?",
    ready: "Are you sure you want to notify customer that order is ready?",
    edit: "Are you sure you want to edit the preparation time for this order?",
  };

  $("#order-cancel").on("submit", (e) =>
    toggleModalHandler(e, modalMessages.cancel)
  );
  $("#preptime").on("submit", (e) => toggleModalHandler(e, modalMessages.add));
  $("#preptime-edit").on("submit", (e) =>
    toggleModalHandler(e, modalMessages.edit)
  );
  $("#order-ready").on("submit", (e) =>
    toggleModalHandler(e, modalMessages.ready)
  );

  $(".close-modal").on("click", (e) => toggleModalHandler(e));

  // need to handle the prep-time submit with an ajax request
  // once request is successful, replace the content of preptime-form and display prep time.
});

const toggleModalHandler = function (e, message = "") {
  e.preventDefault();

  const $modalContainer = $(".modal-container");
  const $modalMessage = $modalContainer.find("p");

  if ($modalContainer.hasClass("hide")) {
    $modalMessage.empty();
    $modalMessage.append(message);
    $modalContainer.removeClass("hide");
  } else {
    $modalContainer.addClass("hide");
  }
};
