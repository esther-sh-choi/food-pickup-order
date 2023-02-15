$(() => {
  $(".collapsible").collapsible();

  const elems = $(".sidenav");
  const instances = M.Sidenav.init(elems, { edge: "right" });

  renderMenu();

  $(document).on("submit", "form.add-to-cart", addToCartHandler);

  $(document).on("submit", "form.checkout", formCheckoutHandler);
});

const renderMenu = () => {
  $.ajax({
    type: "GET",
    url: "/api/customer/menu",
    success: renderAllMenuCards,
  });
};

const checkoutHandler = (inputData) => {
  $.ajax({
    type: "POST",
    url: "/api/customer/checkout",
    data: inputData,
    success: () => {
      window.location.href = "/customer/status";
    },
  });
};

///// The below captures what the customer adds to cart

const cartArray = [];

const addToCartHandler = (event) => {
  event.preventDefault();
  const formDataArray = $(event.target).serializeArray();
  const result = {};
  formDataArray.forEach((data) => {
    result[data.name] = data.value;
  });
  cartArray.push(result);
  renderCart(cartArray);
};

///// The below captures the customer's name and phone number

const formCheckoutHandler = (event) => {
  event.preventDefault();
  const customerData = [];
  const name = $("input#name_input").val();
  const phone_number = $("input#phone_input").val();
  customerData.push(name, phone_number);
  const foodArray = cartArray.map((food) => {
    return Number(food.id);
  });
  checkoutHandler({ foodArray, customerData });
};

///// This function renders the cart tempate.

const renderCart = (customer_orders) => {
  $(".cart-container").empty();
  const ordersObj = {};
  for (const customer_order of customer_orders) {
    if (!ordersObj.hasOwnProperty(customer_order.id)) {
      ordersObj[customer_order.id] = customer_order;
      ordersObj[customer_order.id].quantity = 0;
    }
    ordersObj[customer_order.id].quantity++;

    $(".show-count").empty();
    $(".show-count").append(ordersObj[customer_order.id].quantity);
  }

  const orders = Object.values(ordersObj);
  let subtotal = 0;
  orders.forEach((order) => {
    const { price, quantity } = order;
    subtotal += price * quantity;
  });
  const tax = 0.13 * subtotal;
  const total = subtotal + tax;
  orders.forEach((order) => {
    const { name, quantity, price, id } = order;
    $(".cart-container").append(createCartContents(name, quantity, price, id));
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
    <div class="input-field">
      <label for="name_input">Name</label>
      <input type="text" id="name_input" />
    </div>
    <div class="input-field">
      <label for="phone_input">Phone Number</label>
      <input type="tel" id="phone_input" />
    </div>
    <button type="submit">Checkout</button>
  </form>
`);
};

///// This function creates a template for the cart contents.

const createCartContents = (name, quantity, price, id) => {
  const $cartMenu = $(`
  <div class="menu-item">
  <p>${quantity} x ${name}</p>
  <p>$${price}</p>
  </div>
  `);

  return $cartMenu;
};

///// This function creates a template for each menu card.

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
            <p class="show-count">0</p>
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

///// This function renders the template above in each menu container on the page.

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
