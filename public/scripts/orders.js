$(() => {
  $(".tabs").tabs();

  $.ajax({
    type: "GET",
    url: "/api/restaurant/orders",
    success: renderOrderCards,
  });

  $.ajax({
    type: "POST",
    url: "/api/restaurant/preptime",
    success: updateRemainingTime,
  });

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

const renderOrderCards = (orders) => {
  $(".cards-container").empty();
  orders.forEach((order) => {
    const { order_id, phone_number, preparation_time, foods, is_complete } =
      order;

    if (is_complete) {
      $("#completed").append(
        createOrderCard(order_id, phone_number, preparation_time, foods)
      );
    } else {
      $("#in-progress").append(
        createOrderCard(order_id, phone_number, preparation_time, foods)
      );
    }
  });
};

const createOrderCard = (order_id, phone_number, preparation_time, foods) => {
  let $orderCard = $(`
  <div class="card">
  <div class="card-content">
<span class="card-title activator grey-text text-darken-4"
  >Order ID: ${order_id}<i class="material-icons right">more_vert</i></span
>
<p>Phone Number: <a href="tel:${phone_number}">${phone_number}</a></p>
<ul class='food-list'>

</ul>
<div class="preptime-form-container new">
</div>
</div>
<div class="card-reveal">
<section class="card-reveal-header">
  <span class="card-title grey-text text-darken-4"
    >Order ID: ${order_id}<i class="material-icons right">close</i></span
  >
  <p>Phone Number: <a href="tel:${phone_number}">${phone_number}</a></p>
</section>
<section class="card-reveal-content">
  <div class="preptime-form-container">
    <p>Edit Estimated prep time (minutes)</p>
    <form id="preptime-edit">
      <p class="range-field">
        <input
          type="range"
          id="prep-time"
          name="preparation-time"
          min="15"
          max="70"
          step="5"
        />
      </p>
      <button class="btn modal-trigger">Edit</button>
    </form>
  </div>
  <div class="button-forms">
    <form id="order-ready">
      <button class="btn modal-trigger order-ready">
        Order Ready
      </button>
    </form>
    <form id="order-cancel">
      <button class="btn modal-trigger order-cancel red darken-4">
        Cancel Order
      </button>
    </form>
  </div>
</section>
</div>
</div>`);

  let $foodListContainer = $orderCard.find("ul");
  foods.forEach((food) => {
    $foodListContainer.append(
      `<li>${food.name} x<strong>${food.food_count}</strong></li>`
    );
  });

  let $preptimeFormContainer = $orderCard.find(".preptime-form-container.new");

  let $prepFormContent;
  if (preparation_time) {
    $prepFormContent = $(`
    <p>You set the preparation time to ${
      preparation_time / (60 * 1000)
    } minutes.</p>
    <p id="countdown"></p>`);
  } else {
    $prepFormContent = $(`
    <p>Estimated prep time (minutes)</p>
    <form id="preptime">
     <p class="range-field">
        <!-- <label for="prep-time">Estimated prep time (minutes)</label> -->
        <input
        type="range"
        id="prep-time"
        name="preparation-time"
        min="15"
        max="70"
        step="5"
        />
      </p>
      <button class="btn" type="submit">Submit</button>
    </form>`);
  }
  $preptimeFormContainer.append($prepFormContent);

  return $orderCard;
};

const updateRemainingTime = (order) => {
  const preparation_time = order.preparation_time;
  const deadline = Date.now() + preparation_time * 60 * 1000;
  console.log(order);

  const countdown = setInterval(() => {
    const distance = deadline - Date.now();

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    $.ajax({
      type: "POST",
      url: "/api/restaurant/countdown",
      data: { order_id: order.id },
    });

    if (preparation_time) {
      $("#countdown").empty();
      $("#countdown").append(
        `Time Remaining: ${String(hours).padStart(2, "0")} : ${String(
          minutes
        ).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
      );
    }

    if (distance < 0) {
      clearInterval(countdown);
    }
  }, 1000);
};
