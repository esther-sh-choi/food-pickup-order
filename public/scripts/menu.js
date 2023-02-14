$(() => {
  $(".collapsible").collapsible();

  const elems = $(".sidenav");
  const instances = M.Sidenav.init(elems, { edge: "right" });

  $.ajax({
    type: "GET",
    url: "/api/customer/menu",
    success: renderAllMenuCards,
  });

  const cartArray = [];

  $(document).on("submit", "form.add-to-cart", (e) => {
    e.preventDefault()
    const target = e.target;
    const formData = $(target).serialize();
    const formDataArray = formData.replace(/%20/g, " ").split("&");
    const finalDataArray = formDataArray.map(data => data.split("="));
    const result = {};
    finalDataArray.forEach(data => {
      result[data[0]] = data[1];
    })
    cartArray.push(result);
    renderCartContents(cartArray);
  })
});


const createMenuCard = (name, photo_url, description, price) => {
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
        <input type="hidden" name="menu_item_name" value="${name}"/>
        <input type="hidden" name="menu_item_price" value="${price}"/>
        <button class="add-on-click" type="submit">Add to cart</button>
        </form>
      </div>
    </div>
  </div>
  `)
  return $menuCard;
};


const renderAllMenuCards = (foods) => {
  const categories = [];
  foods.forEach((food) => {
    if (!categories.includes(food.category.toLowerCase())) {
      categories.push(food.category.toLowerCase());
    }
  });
  foods.forEach((food) => {
    const { name, photo_url, description, price } = food;
    $(".all-menu-container").append(
      createMenuCard(name, photo_url, description, price)
      );
  })

  categories.forEach((sectionCategory) => {
    foods.forEach((food) => {
      const { name, category, photo_url, description, price } = food;
      if (sectionCategory === category.toLowerCase()) {
        $(`.${sectionCategory}-menu-container`).append(
          createMenuCard(name, photo_url, description, price)
          );
      }
    })
  })
}




const renderCartContents = (customer_order) => {
  // $(".menu-item-container").append(`
  // <div class="menu-item">
  // <p>${} x ${}</p>
  // <p>${}</p>
  // </div>
  // `);
  console.log(customer_order)

}
