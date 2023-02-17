$(() => {
  $(".collapsible").collapsible();
  const elems = $(".sidenav");
  const instances = M.Sidenav.init(elems, { edge: "right" });

  renderMenu();

  $(document).on("submit", "form.add-to-cart", addToCartHandler);
  $(document).on("submit", "form.remove-from-cart", removeFromCartHandler);
  $(document).on("submit", "form.checkout", formCheckoutHandler);
});

/**
 * This function uses the renderAllMenuCards function to render menu on the customer menu page.
 */
const renderMenu = () => {
  $.ajax({
    type: "GET",
    url: "/api/customer/menu",
    success: renderAllMenuCards,
  });
};

/**
 * This function takes in the data received during the checkout process and then takes the customer to the status page.
 */
const checkoutHandler = (inputData) => {
  $.ajax({
    type: "POST",
    url: "/api/customer/checkout",
    data: inputData,
    success: () => {
      window.location.href = "/customer/status";
    },
    error: (err) => {
      $(".cart-error-message").removeClass("hide");
      $(".cart-error-message").find("p").empty();
      $(".cart-error-message").find("p").append(err.responseJSON.error);
    },
  });
};

/**
 * These variables hold temporary data while the customer is creating their order before they submit it.
 */
const ordersObj = {};

/**
 * This function captures what the customer adds to the cart.
 */
const addToCartHandler = (event) => {
  event.preventDefault();
  const formDataArray = $(event.target).serializeArray();
  const result = {};
  formDataArray.forEach((data) => {
    result[data.name] = data.value;
  });
  renderCart(result, false, ordersObj);
};

/**
 * This function captures what the customer removes from the cart.
 */
const removeFromCartHandler = (event) => {
  event.preventDefault();
  const formDataArray = $(event.target).serializeArray();
  const result = {};
  formDataArray.forEach((data) => {
    result[data.name] = data.value;
  });
  renderCart(result, true, ordersObj);
};

/**
 * This function captures the customer's name and phone number.
 */
const formCheckoutHandler = (event) => {
  event.preventDefault();
  const customerData = [];
  const name = $("input#name_input").val();
  const phone_number = $("input#phone_input").val();
  customerData.push(name, phone_number);

  const foodIdArray = [];
  Object.values(ordersObj).forEach((food) => {
    for (let i = 0; i < food.quantity; i++) {
      foodIdArray.push(Number(food.id));
    }
  });
  checkoutHandler({ foodIdArray, customerData });
};

/**
 * This function renders the cart template.
 */
const renderCart = (customer_order, isRemove, ordersObj) => {
  $(".cart-container").empty();

  if (!isRemove) {
    if (!ordersObj.hasOwnProperty(customer_order.id)) {
      ordersObj[customer_order.id] = customer_order;
      ordersObj[customer_order.id].quantity = 0;
    }
    ordersObj[customer_order.id].quantity++;
  } else {
    if (
      ordersObj.hasOwnProperty(customer_order.id) &&
      ordersObj[customer_order.id].quantity > 0
    ) {
      ordersObj[customer_order.id].quantity--;
    }

    if (
      !ordersObj[customer_order.id] ||
      !ordersObj[customer_order.id].quantity
    ) {
      delete ordersObj[customer_order.id];
    }
  }

  $(`.show-count-${customer_order.id}`).empty();
  $(`.show-count-${customer_order.id}`).html(
    `${
      ordersObj[customer_order.id] ? ordersObj[customer_order.id].quantity : 0
    }`
  );

  const orders = Object.values(ordersObj);
  const foodIdArray = [];
  orders.forEach((food) => {
    for (let i = 0; i < food.quantity; i++) {
      foodIdArray.push(Number(food.id));
    }
  });
  const itemCount = foodIdArray.length;
  $("#cart-count").empty();
  if (itemCount.length) {
    $("#cart-count").append(itemCount);
  }

  let subtotal = 0;
  orders.forEach((order) => {
    const { price, quantity } = order;
    subtotal += price * quantity;
  });
  const tax = 0.13 * subtotal;
  const total = subtotal + tax;

  $(".cart-form").empty();
  $(".cart-form").append("Your cart is empty.");

  if (orders.length) {
    orders.forEach((order) => {
      const { name, quantity, price, id } = order;
      $(".cart-container").append(
        createCartContents(name, quantity, price, id)
      );
    });
    $(".cart-form").empty();
    $(".cart-form").append(`
  <div class="subtotal">
    <h8>Subtotal</h8>
    <p>$${subtotal.toFixed(2)}</p>
  </div>
  <div class="tax">
    <h8>Tax</h8>
    <p>$${tax.toFixed(2)}</p>
  </div>
  <div class="total">
    <h6>TOTAL</h6>
    <h6>$${total.toFixed(2)}</h6>
  </div>
  <div class="divider"></div>
  <form class="checkout">
    <label for="name_input">Name</label>
    <input type="text" id="name_input" />
    <label for="phone_input">Phone Number</label>
    <input type="tel" id="phone_input" maxlength="12" value="+1"  />
    <button class="btn" type="submit">Checkout</button>
  </form>
`);
  }
};

/**
 * This function creates the template for the cart contents.
 */
const createCartContents = (name, quantity, price, id) => {
  const $cartMenu = $(`
  <div class="menu-item">
  <p>${quantity} x ${name}</p>
  <p>$${price}</p>
  </div>
  `);

  return $cartMenu;
};

/**
 * This function creates a template for each menu card.
 */
const createMenuCard = (name, photo_url, description, price, id) => {
  const $menuCard = $(`
    <div class="col s12 m6 l4">
      <div class="card">
        <div class="card-image">
          <img class="menu-image" src="${photo_url}">
        </div>
        <div class="card-content">
          <p class="card-title">${name}</p>
          <p>${description}</p>
        </div>
        <div class="card-action menu-action">
          <h6>$${price}</h6>
          <div class="food-counter">
            <form class="remove-from-cart">
              <input type="hidden" name="id" value="${id}"/>
              <button class="add-on-click browser-default" type="submit"><i class="small material-icons">indeterminate_check_box</i></button>
            </form>
            <p class="show-count-${id}">0</p>
            <form class="add-to-cart">
              <input type="hidden" name="name" value="${name}"/>
              <input type="hidden" name="price" value="${price}"/>
              <input type="hidden" name="id" value="${id}"/>
              <button class="add-on-click browser-default" type="submit"><i class="small material-icons">add_box</i></button>
            </form>
          </div>
        </div>
      </div>
    </div>
 `);
  return $menuCard;
};

/**
 * This function renders the menucard template created above in each collapsible menu container.
 */
const renderAllMenuCards = (foods) => {
  const categories = [];
  foods.forEach((food) => {
    if (!categories.includes(food.category.toLowerCase())) {
      categories.push(food.category.toLowerCase());
    }
  });
  foods.forEach((food) => {
    const { name, photo_url, description, price, id } = food;
    $(".all-menu-container").append(
      createMenuCard(name, photo_url, description, price, id)
    );
  });
  categories.forEach((sectionCategory) => {
    foods.forEach((food) => {
      const { name, category, photo_url, description, price, id } = food;
      if (sectionCategory === category.toLowerCase()) {
        $(`.${sectionCategory}-menu-container`).append(
          createMenuCard(name, photo_url, description, price, id)
        );
      }
    });
  });
};
