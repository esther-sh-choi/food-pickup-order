$(() => {
  $(".collapsible").collapsible();

  const elems = $(".sidenav");
  const instances = M.Sidenav.init(elems, { edge: "right" });

  $.ajax({
    type: "GET",
    url: "/api/customer/menu",
    success: renderAllMenuCards,
  });


  ///// The below captures what the customer adds to cart

  const cartArray = [];

  $(document).on("submit", "form.add-to-cart", (event) => {
    event.preventDefault();
    const formDataArray = $(event.target).serializeArray();
    const result = {};
    formDataArray.forEach((data) => {
      result[data.name] = data.value;
    });
    cartArray.push(result);
    renderCart(cartArray);
  });

  ///// The below captures the customer's name and phone number

  const customerData = [];

  $(document).on("submit", "form.checkout", (event) => {
    event.preventDefault();

    const name = $("input#name_input").val();
    const phone_number = $("input#phone_input").val();

    customerData.push(name, phone_number);
    console.log(customerData);

    const foodArray = cartArray.map((food) => {
      return food.id;
    })

    console.log(foodArray);

  });

});


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
  }

  const orders = Object.values(ordersObj)
  console.log(customer_orders);
  let subtotal = 0;
  orders.forEach((order) => {
    const { price, quantity } = order;
    subtotal += price * quantity;
  })
  const tax = 0.13 * subtotal;
  const total = subtotal + tax;
  orders.forEach((order) => {
    const { name, quantity, price, id } = order;
    console.log(order);
    $(".cart-container").append(
      createCartContents(name, quantity, price, id)
      );

    });
    $(".subtotal").find("p").empty();
    $(".tax").find("p").empty();
    $(".total").find("p").empty();
    $(".subtotal").find("p").append(`$${subtotal.toFixed(2)}`);
    $(".tax").find("p").append(`$${tax.toFixed(2)}`);
    $(".total").find("p").append(`$${total.toFixed(2)}`);
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
}


///// This function creates a template for each menu card.

const createMenuCard = (name, photo_url, description, price, id) => {
  // const menu_item = { name, price };
  const $menuCard = $(`
  <div class="menu-item card horizontal">
    <div class="card-image">
      <img
        src="${photo_url}"
      />
    </div>
    <div class="card-stacked">
      <div class="card-content">
        <p>${name}</p>
        <p>${description}</p>
        <p>${price}</p>
      </div>
      <div class="card-action">
        <form class="add-to-cart">
        <input type="hidden" name="name" value="${name}"/>
        <input type="hidden" name="price" value="${price}"/>
        <input type="hidden" name="id" value="${id}"/>
        <button class="add-on-click" type="submit">Add to cart</button>
        </form>
      </div>
    </div>
  </div>
  `)
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
  })

  categories.forEach((sectionCategory) => {
    foods.forEach((food) => {
      const { name, category, photo_url, description, price, id } = food;
      if (sectionCategory === category.toLowerCase()) {
        $(`.${sectionCategory}-menu-container`).append(
          createMenuCard(name, photo_url, description, price, id)
          );
      }
    })
  })
}
