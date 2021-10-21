var express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //Để lấy thông tin từ body web
const methodOverride = require("method-override"); //Sử dụng PUT, Delete,...
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const favicon = require('serve-favicon');

// -- Call passport
require('./public/js/passport')(passport);

// -- App Error
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// -- Route
const adminRouter = require("./routes/viewAdminRoutes");
const clientRouter = require("./routes/viewClientRoutes");
const backendAdminRouter = require("./routes/backendAdminRoutes");
const backendClientRouter = require("./routes/backendClientRoutes");

var app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// limit 100 request per hour on each IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!' 
});

// add limiter to only api routes
app.use('/admin/api', limiter);
app.use('/client/api', limiter);

app.use(express.static(`${__dirname}/public`));

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(bodyParser.json())

// data sanitization against NOSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// prevent parameter pollution
// app.use(hpp());

app.use(methodOverride('_method'));
 
app.use('/scripts', express.static(__dirname + '/node_modules/jquery-zoom/'));
app.use('/scripts', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/jquery-ui-dist/'));

app.use(session({
  secret: 'gBpwmwE0PmyDKPuLhhmY8CONJQW3TnCujQuoE8nVao',
  resave: false,
  saveUninitialized: true
}
));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// Sử dụng flash
//  -- Kết nối đến flash
app.use(flash())
//  -- Tạo global variable với flash
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(compression());

//~~~~~~ROUTING~~~~~~~

//backend
app.use("/admin/api", backendAdminRouter);
app.use("/client/api", backendClientRouter);

//view
app.use("/admin", adminRouter);
app.use("/" ,clientRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
