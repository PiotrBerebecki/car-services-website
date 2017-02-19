const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const compression = require('compression');
const fs = require('fs');
const config = require('../config');
const q = require('q');
var hbs = require('hbs');


var app = express();

// Note that the following smptp configuration is in a configuration where
// Google apps is used and an smtp relay service is set up allowing connections 
// from ips that are whitelisted in the smtp relay service.
var transporter = nodemailer.createTransport('smtps://' + config.mail.server);

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
app.use(compression());
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
    res.render('offerte-bedankt', { title: 'Buitenbos Customs' });
});

app.post('/contact.html', postContactRequest, (req, res, next) => {
    res.render('contact-bedankt', { title: 'Buitenbos Customs' });
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
  console.log("An error occurred somewhere");
  console.log(err);

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
    var packet;
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var date = req.body.date;
    var message = req.body.message;
    
    if(req.body.packet) {
        packet = services[0].packets.filter(x => x.id == req.body.packet)[0]; 
    }

    // Place email logic here
    var promise;
    if(email && email.match(/.*?@.+?\..+/)) {
        promise = promise ? promise.then(() => {
            return sendMailFromTemplate(
                "email/afspraak-mail-client", 
                { name: name, packet: packet }, 
                "Uw afspraak bij buitenbos customs",
                "info@buitenbospc.nl",
                email
            );
        }) : sendMailFromTemplate(
            "email/afspraak-mail-client", 
            { name: name, packet: packet }, 
            "Uw afspraak bij buitenbos customs",
            "info@buitenbospc.nl",
            email
        );
    }
    promise = promise ? promise.then(() => {
        return sendMailFromTemplate(
            "email/afspraak-mail-owner",
            { name: name, email: email, phone: phone, date: date, message:message, packet: packet },
            "Een nieuwe afspraak verzoek van " + name,
            "info@buitenbospc.nl",
            "info@buitenbospc.nl" 
        );
    }) : sendMailFromTemplate(
        "email/afspraak-mail-owner",
        { name: name, email: email, phone: phone, date: date, message:message, packet: packet },
        "Een nieuwe afspraak verzoek van " + name,
        "info@buitenbospc.nl",
        "info@buitenbospc.nl" 
    );

    if(promise) {
        promise.then(() => {
            next();
        }).catch((err) => {
            next(err);
        })
    } else {
        next();
    }
}

function postMakeOffer(req, res, next) {
    // req.body = name, email, phone, date
    // Place email logic here
     var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var date = req.body.date;
    var message = req.body.message;

    // Place email logic here
    var promise;
    if(email && email.match(/.*?@.+?\..+/)) {
        promise = promise ? promise.then(() => {
            return sendMailFromTemplate(
                "email/offerte-mail-client", 
                { name: name }, 
                "Wij hebben uw offerte aanvraag ontvangen",
                "info@buitenbospc.nl",
                email
            );
        }) : sendMailFromTemplate(
            "email/offerte-mail-client", 
            { name: name }, 
             "Wij hebben uw offerte aanvraag ontvangen",
            "info@buitenbospc.nl",
            email
        );
    }
    promise = promise ? promise.then(() => {
        return sendMailFromTemplate(
            "email/offerte-mail-owner",
            { name: name, email: email, phone: phone, date: date, message:message },
            "Een nieuwe offerte aanvraag van " + name,
            "info@buitenbospc.nl",
            "info@buitenbospc.nl" 
        );
    }) : sendMailFromTemplate(
        "email/offerte-mail-owner",
        { name: name, email: email, phone: phone, date: date, message: message },
        "Een nieuwe offerte aanvraag van " + name,
        "info@buitenbospc.nl",
        "info@buitenbospc.nl" 
    );

    if(promise) {
        promise.then(() => {
            next();
        }).catch((err) => {
            next(err);
        })
    } else {
        next();
    }
}

function postContactRequest(req, res, next) {
    // req.body = name, email, phone, date
    // Place email logic here
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var date = req.body.date;
    var message = req.body.message;

    // Place email logic here
    var promise;
    if(email && email.match(/.*?@.+?\..+/)) {
        promise = promise ? promise.then(() => {
            return sendMailFromTemplate(
                "email/contact-mail-client", 
                { name: name }, 
                "Wij hebben uw contact verzoek ontvangen",
                "info@buitenbospc.nl",
                email
            );
        }) : sendMailFromTemplate(
            "email/contact-mail-client", 
            { name: name }, 
             "Wij hebben uw contact verzoek ontvangen",
            "info@buitenbospc.nl",
            email
        );
    }
    promise = promise ? promise.then(() => {
        return sendMailFromTemplate(
            "email/contact-mail-owner",
            { name: name, email: email, phone: phone, date: date, message:message },
            "Een nieuwe contact verzoek van " + name,
            "info@buitenbospc.nl",
            "info@buitenbospc.nl" 
        );
    }) : sendMailFromTemplate(
        "email/contact-mail-owner",
        { name: name, email: email, phone: phone, date: date, message: message },
        "Een nieuwe contact verzoek van " + name,
        "info@buitenbospc.nl",
        "info@buitenbospc.nl" 
    );

    if(promise) {
        promise.then(() => {
            next();
        }).catch((err) => {
            next(err);
        })
    } else {
        next();
    }
}

/* end of form functions */

function sendMailFromTemplate(template, data, subject, from, to) {
    var execution = q.defer();
    app.render(template, Object.assign({}, data, { layout: false}), (err, data) => {
        if(err) {
            return execution.reject(err);
        }
        sendMail( subject, data, from, to ).then(
            () => {
                execution.resolve();
            },
            (err) => {
                execution.reject(err);
            }
        )
    })
    return execution.promise;
}

function sendMail(subject, body, from, to) {
    var execution = q.defer();
     var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: body
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          return execution.reject(error);
        }
        return execution.resolve();
      })
    return execution.promise;
}