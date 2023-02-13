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


// First I need the actual Menu Cards

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


// Then I need each type of collasible Menu Filled with the cards

const renderAllMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((menu_card) => {
    const { name, photo_url, description, price } = menu_card;

  $(".all-menu-container").append(
    createMenuCard(name, photo_url, description, price)
    );
  })
}

const renderStartersMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

  })
}

const renderMainsMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

  })
}

const renderDessertsMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

  })
}

const renderDrinksMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

  })
}
