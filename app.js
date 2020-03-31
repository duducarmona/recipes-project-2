const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_PATH, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

hbs.registerHelper('json', (object) => JSON.stringify(object));

// eslint-disable-next-line func-names
hbs.registerHelper('or', function (a, b, options) {
  // must use a regular function here otherwise context is lost with arrow function
  if (a || b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifEqualStrings', (a, b, options) => {
  if (a && b) {
    if (a.toString() === b.toString()) {
      return options.fn(this);
    }
  }
  return options.inverse(this);
});

hbs.registerHelper('ifNotEqualStrings', (a, b, options) => {
  if (a && b) {
    if (a.toString() === b.toString()) {
      return options.inverse(this);
    }
  }
  return options.fn(this);
});

hbs.registerHelper('createOption', (recipeIngredient, listIngredient, ingredientName) => {
  let option;
  if (listIngredient.toString() === recipeIngredient.toString()) {
    option = `<option value=${listIngredient} selected>${ingredientName}</option>`;
  } else {
    option = `<option value=${listIngredient}>${ingredientName}</option>`;
  }
  return new hbs.handlebars.SafeString(option);
});

hbs.registerHelper('ifIn', (element, list, options) => {
  if (list.indexOf(element) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifNotIn', (element, list, options) => {
  if (list.indexOf(element) > -1) {
    return options.inverse(this);
  }
  return options.fn(this);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
  secret: 'recipes-to-make-it-all-better',
  resave: true,
  saveUninitialized: true,
  name: process.env.COOKIE_NAME,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash('message');
  next();
});

app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUser = req.session.currentUser;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);

app.use((req, res, next) => {
  next(createError(404));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
