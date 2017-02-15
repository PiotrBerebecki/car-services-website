const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
var hbs = require('hbs');

var app = express();

// Comment this out when deploying
app.disable('view cache');

hbs.registerPartial('footer-extra-text', fs.readFileSync(path.join(__dirname, '../views/partials/footer-extra-text.hbs'), 'utf8'))
hbs.registerPartial('footer-normal', fs.readFileSync(path.join(__dirname, '../views/partials/footer-normal.hbs'), 'utf8'))

app.set('views', path.join(__dirname, '../views'));
app.engine('hbs', hbs.__express)
app.set('view engine', 'hbs');

/* Below are all the routes */

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Buitenbos Customs' });
})

app.get('/index.html', (req, res, next) => {
    res.render('index', { title: 'Buitenbos Customs' });
})

app.get('/prijzen.html', (req, res, next) => {
    res.render('prijzen', { title: 'Buitenbos Customs' });
})

app.get('/afspraak.html', (req, res, next) => {
    res.render('afspraak', { title: 'Buitenbos Customs' });
})

app.get('/offerte.html', (req, res, next) => {
    res.render('offerte', { title: 'Buitenbos Customs' });
})

app.get('/contact.html', (req, res, next) => {
    res.render('contact', { title: 'Buitenbos Customs' });
})

app.get('/bedankt.html', (req, res, next) => {
    res.render('bedankt', { title: 'Buitenbos Customs' });
})

/* end of all the routes */


app.use(express.static(path.join(__dirname, '../public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Open http://localhost:${port} in your browser`);
});
