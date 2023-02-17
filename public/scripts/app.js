/*
Adds a click event listener to the element with ID "landing-customer-button".
When the button is clicked, it prevents the default behavior of submitting a form.
Then, it redirects the user to the URL "/customer/menu".
*/

$(() => {
  $("#landing-customer-button").on("click", (e) => {
    e.preventDefault();
    window.location.href = "/customer/menu";
  });
});
