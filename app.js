var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const authRouter = require('./routes/auth')



const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var plantsRouter = require('./routes/plants');
var forumRouter = require('./routes/forum')
var articlesRouter = require('./routes/articles')

var app = express();

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
      secret: 'your_secret_key',
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth' , authRouter);
app.use('/plants' , plantsRouter);
app.use('/forum' , forumRouter)
app.use('/articles', articlesRouter)

module.exports = app;
