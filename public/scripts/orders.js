$(() => {
  $(".tabs").tabs();

  getOrderCards();

  const modalMessages = {
    "order-cancel": "Are you sure you want to cancel the order?",
    "order-ready":
      "Are you sure you want to notify customer that order is ready?",
    "order-complete": "Are you sure you want to complete this order?",
    "preptime-edit":
      "Are you sure you want to edit the preparation time for this order?",
    "preptime-confirm":
      "Are you sure you want to add the preparation time to this order?",
  };

  $(document).on("submit", "form#preptime-confirm", (e) => {
    toggleModalHandler(e, modalMessages[e.target.id], e.target);
  });
  $(document).on("submit", "form.update", (e) => {
    toggleModalHandler(e, modalMessages[e.target.id], e.target);
  });

  $(document).on("click", ".close-modal", (e) => {
    toggleModalHandler(e);
  });
});

/*------------------------------------------------------------------------------------*/
const toggleModalHandler = (e, message = "", target) => {
  e.preventDefault();

  const $modalContainer = $(".modal-container");
  const $modalMessage = $modalContainer.find("p");

  if ($modalContainer.hasClass("hide")) {
    $modalMessage.empty();
    $modalMessage.append(message);
    $modalContainer.removeClass("hide");
    $(document).on("click", ".confirm-button", (e) => {
      if (target) {
        if (target.id === "preptime-confirm") {
          confirmOrderForm(e, target);
        } else {
          submitUpdateOrderForm(e, target);
        }
      }
    });
  } else {
    $modalContainer.addClass("hide");
  }
};

/*------------------------------------------------------------------------------------*/

const getOrderCards = () => {
  $.ajax({
    type: "GET",
    url: "/api/restaurant/orders",
    success: renderOrderCards,
  });
};

/*------------------------------------------------------------------------------------*/

const confirmOrderForm = function (e, target) {
  e.preventDefault();

  const formData = $(target).serialize();
  const order_id = formData
    .split("&")
    .map((data) => data.split("="))
    .find((data) => data[0] === "order_id")[1];

  $.ajax({
    type: "POST",
    url: `/api/restaurant/orders/${order_id}/confirm`,
    data: formData,
    success: getOrderCards(),
  });
};

/*------------------------------------------------------------------------------------*/

const submitUpdateOrderForm = function (e, target) {
  e.preventDefault();

  const formData = $(target).serialize();
  const order_id = formData
    .split("&")
    .map((data) => data.split("="))
    .find((data) => data[0] === "order_id")[1];

  $.ajax({
    type: "POST",
    url: `/api/restaurant/orders/${order_id}/update`,
    data: formData,
    success: getOrderCards(),
  });
};

/*------------------------------------------------------------------------------------*/

const renderOrderCards = (orders) => {
  const $modalContainer = $(".modal-container");
  $modalContainer.addClass("hide");
  $(".cards-container").empty();

  orders.forEach((order) => {
    const {
      order_id,
      phone_number,
      estimated_ready_at,
      ready_at,
      foods,
      is_complete,
      is_cancelled,
    } = order;

    if (is_cancelled) {
      return;
    }

    if (is_complete) {
      $("#completed").append(
        createOrderCard(
          order_id,
          phone_number,
          estimated_ready_at,
          foods,
          ready_at,
          is_complete,
          updateRemainingTime
        )
      );
    } else {
      $("#in-progress").append(
        createOrderCard(
          order_id,
          phone_number,
          estimated_ready_at,
          foods,
          ready_at,
          is_complete,
          updateRemainingTime
        )
      );
    }
  });
};

/*------------------------------------------------------------------------------------*/

const createOrderCard = (
  order_id,
  phone_number,
  estimated_ready_at,
  foods,
  ready_at,
  is_complete,
  countdownFn
) => {
  const $orderCard = $(`
  <div class="card col">
  <div class="card-content">
<span class="card-title activator grey-text text-darken-4"
  >Order ID: ${order_id}<i id="options_icon" class="material-icons right">more_vert</i></span
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
  <div class="preptime-form-container edit">

  </div>
  <div class="button-forms">
    <form class="update" id="order-ready">
      <input type='hidden' name='isReady' value='true' />
      <input type='hidden' name='order_id' value='${order_id}' />
      <button class="btn modal-trigger order-ready">
        Order Ready
      </button>
    </form>
    <form class="update" id="order-cancel">
      <input type='hidden' name='is_cancelled' value='true' />
      <input type='hidden' name='order_id' value='${order_id}' />
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

  if (ready_at) {
    $prepFormContent = $(`
    <form class="update" id="order-complete">
      <input type='hidden' name='is_complete' value='true' />
      <input type='hidden' name='order_id' value='${order_id}' />
      <button class="btn modal-trigger order-complete">
        Complete Order
      </button>
    </form>
  `);
  }

  if (is_complete) {
    $orderCard.find(".card-reveal").remove();
    $orderCard.find("#options_icon").remove();
    $prepFormContent = $(`
    <p>
      Congratulations! This order is now complete.
    </p>
  `);
  }

  if (estimated_ready_at && !ready_at && !is_complete) {
    const utcDate = new Date(estimated_ready_at);
    const localTime = new Date(
      utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000
    ).toLocaleTimeString();

    $prepFormContent = $(`
    <p>You have until ${localTime} to prepare this order.</p>
    <p id="countdown_${order_id}"></p>`);

    $orderCard.find(".preptime-form-container.edit").append(`
      <form class="update" id="preptime-edit">
        <label for="preptime-input" >Estimated prep time (minutes)</label>
        <div class='input-container'>
          <input
          class="browser-default"
          id="preptime-input"
          type="number"
          name="preparation_time"
          min="10"
          max="70"
          step='5'
          />
          <input type='hidden' name='order_id' value='${order_id}' />
          <button id="preptime-button" class="btn" type="submit">Submit</button>
        </div>
      </form>
`);
  } else if (!estimated_ready_at && !ready_at) {
    $prepFormContent = $(`
    <form id="preptime-confirm">
      <label for="preptime-input" >Estimated prep time (minutes)</label>
      <div class='input-container'>
        <input
        class="browser-default"
        id="preptime-input"
        type="number"
        name="preparation_time"
        min="10"
        max="70"
        step='5'
        />
        <input type='hidden' name='order_id' value='${order_id}' />
        <button id="preptime-button" class="btn" type="submit">Confirm</button>
      </div>
    </form>
    `);
  }

  $preptimeFormContainer.append($prepFormContent);

  countdownFn(estimated_ready_at, order_id);

  return $orderCard;
};

const updateRemainingTime = (estimated_ready_at, order_id) => {
  const dateExpectedReadyAt = new Date(estimated_ready_at);
  const msSinceEpoch = dateExpectedReadyAt.getTime();
  const countdown = setInterval(() => {
    const timeRemaining = msSinceEpoch - Date.now();

    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    if (estimated_ready_at) {
      $(`#countdown_${order_id}`).empty();
      $(`#countdown_${order_id}`).append(
        `Time Remaining: ${String(hours).padStart(2, "0")} : ${String(
          minutes
        ).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`
      );
    }

    if (timeRemaining < 0) {
      clearInterval(countdown);
      $(`#countdown_${order_id}`).empty();
      $(`#countdown_${order_id}`).append(`Time's up!`);
    }
  }, 1000);
};
