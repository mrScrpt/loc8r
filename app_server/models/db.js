let mongoose = require('mongoose');


const dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI, {useNewUrlParser: true})
  .then(res=>{
    console.log('Подключены к ' + dbURI)

  })
  .catch(rej=>{
    console.log('Ошибка: ' + rej)
  });



// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', ()=> {
  gracefulShutdown('nodemon restart', ()=> {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', ()=> {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', ()=> {
    process.exit(0);
  });
});
