const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');


const db = require('./config/keys').mongoURI;
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*
    connection to mongodb from mongoURI 
*/
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))


//Passport middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);


/*
    @des: router from routes folder
*/
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

const port = process.env.PORT | 5000;

app.listen(port, () => console.log(`App is Running On Port ${port}`));