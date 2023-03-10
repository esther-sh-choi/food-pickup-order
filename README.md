# Order Up - Midterm Group Project

## Team Members and Project Authors

So Hyun (Esther) Choi - https://github.com/esther-sh-choi

Ashley Ure - https://github.com/dorreb

Jonathan Phair - https://github.com/jmphair

## Project Description

"Order Up" is a multi-page food pickup ordering app.

This is a fullstack project and relies on the following to run.

Front-end: HTML, CSS, JS, jQuery, and AJAX. 

Back-end: Node, Express, and PG.

## Why Order Up?

The customer experience:

  This page is a deliberately simple and easy to use menu. Any customer visiting this page is likely linking to it from the restaurants website or Google Maps info and they want to place their order ASAP! No account creation hassle needed.

  When a customer visits the page they can place an order simply by including their name and phone number with their order during the checkout process. 

  All of this data is stored securely in a cookie-session and allows the customer to view their order status on the status page. Once the customer has submitted their order, the restaurant is notified by SMS thanks to Twilio integration. The customer's order card also appears on the order page's in-progress orders. 

The restaurant experience: 

  This page acts as a minimalist digital representation of the back of house area of a restaurant called the pass, where all the night's orders are often displayed as paper tickets. 

  Employees at the restaurant using this app can login as admin to view all the orders that are in-progress, completed, and cancelled. These orders are displayed as cards on the screen. Employees can update the order status and preptime on each cards as they are prepared. All updates are sent to both the customer status page and directly to the customer's phone via SMS thanks to Twilio integration. 

## Page Demo Details

Restaurant Order Page Functionality:

!["GIF of the Restaurant Order Page Functionality"](https://github.com/esther-sh-choi/food-pickup-order/blob/master/public/docs/Readme%20Media/Restaurant-Orders-Functionality.gif?raw=true)

Customer Menu Page Functionality:

!["GIF of the Customer Menu Page Functionality"](https://github.com/esther-sh-choi/food-pickup-order/blob/master/public/docs/Readme%20Media/Customer-Menu-Functionality.gif?raw=true)

Mobile Landing Page:

!["Screenshot of the Mobile Landing Page"](https://github.com/esther-sh-choi/food-pickup-order/blob/master/public/docs/Readme%20Media/Mobile-Landing-Page.jpg?raw=true)

Desktop Landing Page:

!["Screenshot of the Desktop Landing Page"](https://github.com/esther-sh-choi/food-pickup-order/blob/master/public/docs/Readme%20Media/Desktop-Landing-Page.jpg?raw=true)

Restaurant Login Page:

!["Screenshot of the Restaurant Login Page"](https://github.com/esther-sh-choi/food-pickup-order/blob/master/public/docs/Readme%20Media/Restaurant-Login-Page.jpg?raw=true)

Customer Status Page:

!["GIF of the Customer Status Page Functionality"](https://github.com/esther-sh-choi/food-pickup-order/blob/master/public/docs/Readme%20Media/Status-Page.png?raw=true)

## Getting Started

1. Fork this repo, then clone your fork of this repo.
2. Install dependencies using the `npm install` command.
3. Install dev-dependencies using the `npm install --save-dev` command.
4. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
5. Update the .env file with your correct local information 
  - NOTE: you will need to update the phone numbers needed by TWILIO in the routes for SMS functionality. 
6. Fix to binaries for sass: `npm rebuild node-sass`
7. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
8. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
9. Go to <http://localhost:8080/> in your browser.

## Warnings & Tips

- Do not edit the `layout.css` file directly, it is auto-generated by `layout.scss`.
- Split database schema (table definitions) and seeds (inserts) into separate files, one per table. See `db` folder for pre-populated examples. 
- Use helper functions to run your SQL queries and clean up any data coming back from the database. See `db/queries` for pre-populated examples.
- Use the `npm run db:reset` command each time there is a change to the database schema or seeds. 
  - It runs through each of the files, in order, and executes them against the database. 
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- Bcrypt ^5.1.0
- Chalk ^2.4.2
- Cookie-Session ^2.0.0
- Dotenv ^2.0.0
- EJS ^2.6.2
- Express ^4.17.1
- Materialize-CSS ^1.0.0-rc.2
- Morgan ^1.9.1
- PG ^8.5.0,
- SASS ^1.35.1
- Twilio ^4.7.2

## Dev Dependencies

- Nodemon ^1.9.2

## THANK YOU
We appreciate you taking the time to look at this project.
