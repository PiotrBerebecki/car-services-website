const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
var hbs = require('hbs');

var app = express();

var services = [
    { 
        id: 1, 
        name: 'Ramen tinten', 
        packets: [
            { id: 1, name: 'Pakket 1', price: 169 },
            { id: 2, name: 'Pakket 2', price: 239 },
            { id: 3, name: 'Pakket 3', price: 299 }
        ]
    }
]

// Comment this out when deploying
app.disable('view cache');

hbs.registerPartial('footer-extra-text', fs.readFileSync(path.join(__dirname, '../views/partials/footer-extra-text.hbs'), 'utf8'));
hbs.registerPartial('footer-normal', fs.readFileSync(path.join(__dirname, '../views/partials/footer-normal.hbs'), 'utf8'));
hbs.registerPartial('recension-slider-side', fs.readFileSync(path.join(__dirname, '../views/partials/recension-slider-side.hbs'), 'utf8'));

app.set('views', path.join(__dirname, '../views'));
app.engine('hbs', hbs.__express)
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: true
}))

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
    var packet = undefined;
    if(req.query.pakket) {
        packet = services[0].packets.filter(x => x.id == req.query.pakket)[0]; 
    }
    res.render('afspraak', { title: 'Buitenbos Customs', packet: packet });
});

app.get('/offerte.html', (req, res, next) => {
    res.render('offerte', { title: 'Buitenbos Customs' });
})

app.get('/contact.html', (req, res, next) => {
    res.render('contact', { title: 'Buitenbos Customs' });
})

app.post('/afspraak.html', postMakeAppointment, (req, res, next) => {
    res.render('bedankt', { title: 'Buitenbos Customs' });
});

app.post('/offerte.html', postMakeOffer, (req, res, next) => {
    res.render('bedankt', { title: 'Buitenbos Customs' });
});

app.post('/contact.html', postContact, (req, res, next) => {
    res.render('bedankt', { title: 'Buitenbos Customs' });
});



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

/* form functions */

function postMakeAppointment(req, res, next) {
    // req.body = name, email, phone, date, packet
    // Place email logic here
    next();
}

function postMakeOffer(req, res, next) {
    // req.body = name, email, phone, date
    // Place email logic here
    next();
}

function postContactRequest(req, res, next) {
    // req.body = name, email, phone, date
    // Place email logic here
    next();
}

/* end of form functions */