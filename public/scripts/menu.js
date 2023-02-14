$(() => {
  $(".collapsible").collapsible();

  const elems = $(".sidenav");
  const instances = M.Sidenav.init(elems, { edge: "right" });

  $.ajax({
    type: "GET",
    url: "/api/customer/menu",
    success: renderAllMenuCards,
  });

});


const createMenuCard = (name, photo_url, description, price) => {
  let $menuCard = $(`
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
        <a href="#">Add to cart</a>
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

}
