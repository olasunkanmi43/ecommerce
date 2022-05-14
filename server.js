const express = require('express'),
      mongoose = require('mongoose'),
      flash = require('connect-flash'),
      session = require('express-session'),
      app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ecommerce", {useNewUrlParser:true});

// EXPRESS-SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// CONNECT FLASH THIS IS WHAT SEND US THE ERROR MESSAGES

app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash('message');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


// WE IMPORT THE ROUTES FILES
app.use('/', require('./routes/uRoutes'));
app.use('/', require('./routes/mRoutes'));

app.listen(4040, () => {
    console.log('Server started on port 4040');
})