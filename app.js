const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerHelper('ifEqual', (a, b, options) => {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifNotEqual', (a, b, options) => {
  if (a !== b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('json', (object) => JSON.stringify(object));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
  secret: 'basic-auth-secret',
  resave: true,
  saveUninitialized: false,
  name: process.env.COOKIE_NAME,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipes', recipesRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
