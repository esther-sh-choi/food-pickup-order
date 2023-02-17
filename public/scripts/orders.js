$(() => {
  $(".tabs").tabs();

  getOrderCards();

  $(document).on("click", ".close-modal", (e) => {
    $(".modal-container").addClass("hide");
  });
});


/*
 Defines a function openFoodListModal that is called when an event is triggered.
 The function extracts the orderId property from the data attribute of the element that triggered the event.
 The orderId is used to display the order ID in the food modal that is displayed.
 The function retrieves the list of food items for the specified order from the orderObj object and iterates over them to create a list of food items.

*/

let orderObj = {};

const openFoodListModal = (event) => {
  event.preventDefault();
  const orderData = event.target.dataset;
  const { orderId } = orderData;

  $("#food-modal").removeClass("hide");

  $(`.food-modal-content`).empty();
  $(`.food-modal-content`).append(
    `<h5 class="card-title">Order ID: ${orderId}</h5>`
  );

  $(".food-modal-content").append(`<ul id="food-list-${orderId}" ></ul>`);

  const foodItems = orderObj[orderId].foods;
  foodItems.forEach((food) => {
    $(`#food-list-${orderId}`).append(
      `<li>${food.quantity}</strong> x ${food.name}</strong></li>`
    );
  });
};

/*------------------------------------------------------------------------------------*/
/*
Uses an AJAX GET request to fetch data about orders from the restaurant's API.
When the request is successful, it calls the renderOrderCards function to render the order cards on the page.
*/
const getOrderCards = () => {
  $.ajax({
    type: "GET",
    url: "/api/restaurant/orders",
    success: renderOrderCards,
  });
};

/*------------------------------------------------------------------------------------*/
/*
This function is called when the restaurant confirms an order.
It uses an AJAX POST request to send data about the order to the API and confirm it.
If the request is successful, it calls getOrderCards() to refresh the order cards on the page.
*/
const onConfirm = (data) => {
  $.ajax({
    type: "POST",
    url: `/api/restaurant/orders/${data.orderId}/confirm`,
    data: data,
    success: function(result) {
      getOrderCards();
    },
    error: function(err) {
      console.log("there was an error :", err);
    },
  });
};

/*
This function is called when the restaurant edits an order.
It uses an AJAX POST request to send updated data about the order to the API.
*/

const onEdit = (data) => {
  $.ajax({
    type: "POST",
    url: `/api/restaurant/orders/${data.orderId}/update`,
    data: data,
    success: function(result) {
      getOrderCards();
    },
    error: function(err) {
      console.log("there was an error :", err);
    },
  });
};

/*------------------------------------------------------------------------------------*/

/*
This function is called when the user submits a form to confirm or edit an order.
The function extracts the data object and the preptime value from the form and creates a new object called completeData that combines this information.
If the type of action is "confirm", the function calls toggleModalHandler with the onConfirm function and the completeData object as arguments.
If the type of action is not "confirm", the function calls toggleModalHandler with the onEdit function and the completeData object as arguments.
*/

const orderFormHandler = function(event) {
  event.preventDefault();

  const data = event.target.dataset;
  const preptime = $(event.target)
    .find(`[id='preptime-form-${data.orderId}']`)
    .val();
  const completeData = {
    preptime: 0,
    isComplete: false,
    isCancelled: false,
    ...data,
    preptime,
  };

  if (data.type === "confirm") {
    toggleModalHandler(onConfirm, completeData);
  } else {
    toggleModalHandler(onEdit, completeData);
  }
};

/*------------------------------------------------------------------------------------*/

/*
This function is called when the user clicks a button to show a confirmation modal.
It takes two arguments: formSubmitHandler is a function that will be called if the user confirms the action, and data is an object containing information about the order and the type of action to be confirmed.
The function displays a modal with a message asking the user to confirm the action.
If the user confirms the action, the function calls the formSubmitHandler function with the data object as an argument.
If the user cancels the action, the function hides the modal.
*/

const toggleModalHandler = (formSubmitHandler, data) => {
  const $modalContainer = $("#form-modal");
  const $modalMessage = $modalContainer.find("p");

  const modalMessages = {
    cancel: "Are you sure you want to cancel the order?",
    ready:
      "Are you sure you want to notify the customer that the order is ready?",
    complete: "Are you sure you want to complete this order?",
    edit: "Are you sure you want to edit the preparation time for this order?",
    confirm: "Are you sure you want to add the preparation time to this order?",
  };

  if ($modalContainer.hasClass("hide")) {
    $modalMessage.empty();
    $modalMessage.append(modalMessages[data.type]);
    $modalContainer.removeClass("hide");
    /////////////////////////////////////////////////////////////////
    $modalContainer.find(".confirm-button").prop("onclick", null).off("click");
    $modalContainer.find(".confirm-button").on("click", () => {
      formSubmitHandler(data);
    });
    // every time this line runs it adds a new event handler to it //
  } else {
    $modalContainer.addClass("hide");
  }
};

/*------------------------------------------------------------------------------------*/

/*
This function receives an array of orders data.
It parses the data and groups the order items by their order_id.
The function then uses the createOrderCard function to create a card for each order and appends them to their respective categories.
*/

const renderOrderCards = (ordersData) => {
  const parsedOrders = {};
  ordersData.forEach((order) => {
    const {
      order_id,
      created_at,
      estimated_ready_at,
      is_complete,
      ready_at,
      is_cancelled,
      phone_number,
      customer_name,
    } = order;
    if (!parsedOrders[order_id]) {
      const orderObj = {
        order_id,
        created_at,
        estimated_ready_at,
        is_complete,
        ready_at,
        is_cancelled,
        phone_number,
        customer_name,
        foods: [],
      };

      parsedOrders[order_id] = orderObj;
    }

    const parsedProduct = {
      name: order.name,
      quantity: Number(order.food_quantity),
    };

    parsedOrders[order_id].foods.push(parsedProduct);
  });

  orderObj = { ...parsedOrders };

  const orders = Object.values(parsedOrders);

  const $modalContainer = $("#form-modal");
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
      customer_name,
    } = order;

    if (is_complete) {
      $("#completed").append(
        createOrderCard(
          order_id,
          phone_number,
          estimated_ready_at,
          foods,
          ready_at,
          is_complete,
          updateRemainingTime,
          is_cancelled,
          customer_name
        )
      );
    } else if (is_cancelled) {
      $("#cancelled").append(
        createOrderCard(
          order_id,
          phone_number,
          estimated_ready_at,
          foods,
          ready_at,
          is_complete,
          updateRemainingTime,
          is_cancelled,
          customer_name
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
          updateRemainingTime,
          is_cancelled,
          customer_name
        )
      );
    }
  });
};

/*------------------------------------------------------------------------------------*/

/*
This function creates an HTML element that represents a food order card.
It updates the HTML of the div element with the relevant order information.
The function also adds click events to the buttons so that they will trigger a specified function when clicked.
The function checks if certain conditions are met and updates the card accordingly by removing elements or adding new ones to the HTML.
If the estimated_ready_at parameter is not null, a countdown timer is added to the order card using the countdownFn parameter that is passed in.
*/

const createOrderCard = (
  order_id,
  phone_number,
  estimated_ready_at,
  foods,
  ready_at,
  is_complete,
  countdownFn,
  is_cancelled,
  customer_name
) => {
  const $orderCard = $(`
  <div class="col s12 m6 l3">
    <div class="card">
      <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">
          Order ID: ${order_id}
          <i class="material-icons right options-icon">more_vert</i>
        </span>
        <p>Phone Number: <a href="tel:${phone_number}">${phone_number}</a></p>

        <ul class='food-list'>
        </ul>

        <div class="preptime-form-container new">
        </div>

        <form data-order-id="${order_id}" onSubmit="openFoodListModal(event)">
          <button type="submit" class="view-all-food-button btn-flat N/A transparent open-food-list">Expand Order</button>
        </form>
      </div>
      <div class="card-reveal">
        <section class="card-reveal-header">
          <span class="card-title grey-text text-darken-4">
            Order ID: ${order_id}
            <i class="material-icons right">close</i>
          </span>
          <p>Phone Number: <a href="tel:${phone_number}">${phone_number}</a></p>
        </section>
        <section class="card-reveal-content">
          <div class="preptime-form-container edit">

          </div>
          <div class="button-forms">
            <form class="update" data-type="ready" data-order-id="${order_id}" data-phone-number="${phone_number}" data-customer-name="${customer_name}" onSubmit="orderFormHandler(event)" id="order-ready">
              <button class="btn modal-trigger order-ready" type="submit">
                Order Ready
              </button>
            </form>
            <form class="update" data-is-cancelled="true" data-phone-number="${phone_number}" data-type="cancel"  data-customer-name="${customer_name}" data-order-id="${order_id}" onSubmit="orderFormHandler(event)" id="order-cancel">
              <button class="btn modal-trigger order-cancel red darken-4" type="submit">
                Cancel Order
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>`);

  let $foodListContainer = $orderCard.find("ul");
  foods.forEach((food) => {
    $foodListContainer.append(
      `<li><strong>${food.quantity}</strong> x ${food.name}</li>`
    );
  });

  let $preptimeFormContainer = $orderCard.find(".preptime-form-container.new");

  let $prepFormContent;

  if (is_cancelled) {
    $prepFormContent = $(`
    <p>This order was cancelled.</p>`);
    $orderCard.find(".card-reveal").remove();
    $orderCard.find(".options-icon").remove();
    $orderCard.find(".card-title").removeClass("activator");
  }

  if (ready_at) {
    $prepFormContent = $(`
    <form class="update" id="order-complete" data-is-complete="true" data-phone-number="${phone_number}" data-customer-name="${customer_name}" data-type="complete" data-order-id='${order_id}' onSubmit="orderFormHandler(event)" >
      <button class="btn modal-trigger order-complete" type="submit">
        Complete Order
      </button>
    </form>
  `);
    $orderCard.find(".card-reveal").remove();
    $orderCard.find(".options-icon").remove();
    $orderCard.find(".card-title").removeClass("activator");
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

  if (estimated_ready_at && !ready_at && !is_complete && !is_cancelled) {
    const date = new Date(estimated_ready_at);
    const localTime = date.toLocaleTimeString();

    $prepFormContent = $(`
    <p>You have until ${localTime} to prepare this order.</p>
    <p id="countdown_${order_id}"></p>`);

    countdownFn(estimated_ready_at, order_id);

    $orderCard.find(".preptime-form-container.edit").append(`
      <form class="update" id="preptime-edit" data-type="edit" data-phone-number="${phone_number}" data-customer-name="${customer_name}" data-order-id="${order_id}" onSubmit="orderFormHandler(event)" >
        <label for="preptime-input" >How much more time do you need? (minutes)</label>
        <div class='input-container'>
          <input
          class="browser-default"
          id="preptime-form-${order_id}"
          type="number"
          name="preparation_time"
          min="10"
          max="70"
          step='5'
          />
          <button id="preptime-button" class="btn" type="submit">Submit</button>
        </div>
      </form>
`);
  } else if (!estimated_ready_at && !ready_at && !is_cancelled) {
    $prepFormContent = $(`
    <form id="preptime-confirm" data-type="confirm" data-phone-number="${phone_number}" data-customer-name="${customer_name}" data-order-id="${order_id}" onSubmit="orderFormHandler(event)" >
      <label for="preptime-input" >Estimated prep time (minutes)</label>
      <div class='input-container'>
        <input
        class="browser-default"
        id="preptime-form-${order_id}"
        type="number"
        name="preparation_time"
        min="10"
        max="70"
        step='5'
        />
        <button id="preptime-button" class="btn">Confirm</button>
      </div>
    </form>
    `);
  }

  $preptimeFormContainer.append($prepFormContent);

  return $orderCard;
};
