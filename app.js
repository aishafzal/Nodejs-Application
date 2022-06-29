var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");
var User = require("./models/User");
const UserController = require('./controllers/userController');
const ProductController = require('./controllers/productController');

var app = express();
app.set('view engine','ejs');
// set our application port
app.set("port", 4000);

// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/product");
  } else {
    next();
  }
};

//route for product create delete update view
app.get('/create',ProductController.create);
app.get('/product',ProductController.product);
app.post('/create/product',ProductController.creates);
app.get('/edit',ProductController.edit);
app.post('/product/update/:pid',ProductController.update);
app.post('/product/delete/:pid',ProductController.deleted);




// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});


// route for user signup
app
  .get('/signup',sessionChecker,UserController.signup)
  .post('/signup',UserController.usersignup);

app
  .get('/login',sessionChecker,UserController.login)
  .post('/login',UserController.authenticate);





// route for user's dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('dashboard');
  } else {
    res.redirect("/login");
  }
});

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// start the express server
app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);