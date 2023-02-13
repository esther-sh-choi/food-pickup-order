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
  // $(".menu-container").empty();
  console.log(foods);
  const categories = [];
  foods.forEach((food) => {
    if (!categories.includes(food.category.toLowerCase())) {
      categories.push(food.category.toLowerCase());
    }
  });
  console.log(categories);
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


// Feels repetitive...

const renderStartersMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

    $(".starters-menu-container").append(
      createMenuCard(name, photo_url, description, price)
      );

  })
}

const renderMainsMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

    $(".mains-menu-container").append(
      createMenuCard(name, photo_url, description, price)
      );

  })
}

const renderDessertsMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

    $(".desserts-menu-container").append(
      createMenuCard(name, photo_url, description, price)
      );

  })
}

const renderDrinksMenuCards = (foods) => {
  $(".menu-container").empty();
  foods.forEach((food_card) => {
    const { name, photo_url, description, price } = food_card;

    $(".drinks-menu-container").append(
      createMenuCard(name, photo_url, description, price)
      );

  })
}
