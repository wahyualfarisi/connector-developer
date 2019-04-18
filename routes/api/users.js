const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bycript = require('bcryptjs');
const keys    = require('../../config/keys');
const jwt     = require('jsonwebtoken');
const passport = require('passport');

//load input validation 
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//load user models
const User = require('../../models/User');

// @route  GET api/Users/test
// @desc   Test Users Route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Users It's Works " }));

// @route  GET api/Users/Register
// @desc   Register Users Route
// @access public
router.post('/register', (req, res) => {

    //destruc from validation
    const {errors, isValid} = validateRegisterInput(req.body);

    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    //findOne by Email , if email already response => 404
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user){
            errors.email = 'Email Already Exists';
            return res.status(404).json(errors);
        }else{
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar,
            });

            //generate password to hash
            bycript.genSalt(10, (err, salt) => {
                bycript.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;

                    //hashing plaintext
                    newUser.password = hash;

                    //save to mongo
                    newUser.save()
                        .then(user => res.json(user) )
                        .catch(err => console.log(err))
                });
            });

            
        }//end else
    });
});

// @route  GET api/Users/Login
// @desc   Login Users Route / Register a Token
// @access public
router.post('/login', (req, res) => {
     //destruc from validation
     const {errors, isValid} = validateLoginInput(req.body);

     // check validation
     if(!isValid){
         return res.status(400).json(errors);
     }


    const email = req.body.email;
    const password = req.body.password;

    //findOne to Check user by email
    User.findOne( {email} )
        .then(user => {
            if(!user){
                errors.email = 'User not found';
                return res.status(404).json(errors)
            }

            //compare req password from user into actual data on mongodb
            bycript.compare(password, user.password).then(isMatch => {
                if(isMatch){
                    //create payload
                    const payload = { id: user.id, name: user.name, avatar: user.avatar }

                    //create JWT and send it .
                    jwt.sign(payload, keys.secretOrKeys, {expiresIn: 3600}, (err, token) => {
                        res.json({
                            success: true,
                            token: 'bearer ' + token
                        });
                    });

                }else{
                    errors.password = 'Password InCorrect !'
                    return res.status(404).json(errors);
                }
            });
        });
});


// @route  GET api/Users/current
// @desc   return current user
// @access private
router.get('/current', passport.authenticate('jwt', {session: false}), ( req, res ) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})



module.exports = router;