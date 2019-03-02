//mongoose
require('./app_api/models/db');

const createError = require('http-errors')
  ,express = require('express')
  ,path = require('path')
  ,cookieParser = require('cookie-parser')
  ,logger = require('morgan')
  //,uglifyJs = require("uglify-js")
  ,fs = require('fs')
  ,routes = require('./app_server/routes/locations')
  ,routesApi = require('./app_api/routes/index')
  //,users = require('./app_server/routes/users')
  ,app = express();

//require('.app_api/routes')(app);

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

//app.use('/', routes);
app.use('/api', routesApi);
//app.use('/users', users);
app.use((req,res)=>{
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'))
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.use((req,res)=>{
//   res.sendfile(path.join(__dirname, 'app_client', 'index.html'))
// });

module.exports = app;
