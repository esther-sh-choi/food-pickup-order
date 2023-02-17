const express = require("express");
const router = express.Router();
const restaurantQueries = require("../db/queries/restaurants");

/*
GET request which renders the orders view with the owner set to the user object stored in the session, and the status set to false.
*/
router.get("/orders", (req, res) => {
  const user = req.session.user;

  // Create getUserById and search restaurant table
  if (user) {
    res.render("orders", { owner: user, status: false });
  }
});


/*
GET request which checks if there is already a user logged in by checking the user object stored in the session.
*/
router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/restaurant/orders");
  }

  res.render("login", { errorMessage: "" });
});


/*
Function that queries the database for the user with the specified username.
Returns the user if the specified password matches the user's password.
 */
const login = function(username, password) {
  return restaurantQueries.getAdminWithUsername(username).then((user) => {
    if (password === user.password) {
      return user;
    }
    return null;
  });
};


/*
POST request that checks if the username and password fields are not empty.
If any of them are empty, it renders the login view with an error message.
Calls the login helper function with the provided username and password.
If the function returns null, it renders the login view with an error message.
Otherwise, it sets the user object in the session to the returned user and redirects.
*/

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || (!username && !password)) {
    return res
      .status(400)
      .render("login", { errorMessage: "You cannot submit empty fields." });
  }

  login(username, password)
    .then((user) => {
      if (!user) {
        return res.status(403).render("login", {
          errorMessage: "This username/password does not exist.",
        });
      }
      req.session.user = user;
      res.redirect("/restaurant/orders");
    })
    .catch((e) => res.send(e));
});



/*
POST request.
Sets the user object in the session to null.
 */
router.post("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

module.exports = router;
