const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load validateprofileinput 
const validateprofileinput = require('../../validation/profile');

//load profile models
const Profile = require('../../models/Profile');

//load users models
const User = require('../../models/User');

// @route  GET api/profile/test
// @desc   Test Profile Route
// @access public
router.get('/test', (req, res) => res.json({ msg: "It's Works " }));

// @route  GET api/profile
// @desc   Get current users profile
// @access private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};
    //find one profile model
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(400).json(errors));
});

// @route  POST api/profile
// @desc   create or edit user profile
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    //destructuring validationprofileinput
    const {errors, isValid} = validateprofileinput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors)
    }

    //get fields 
    const profileFields = {};

    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skils (split into array)
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',')
    }

    //social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    //check profile 
    Profile.findOne({ user: req.body.user })
        .then( profile => {
            if(profile){
                //update data
                Profile.findOneAndUpdate( {user: req.body.user} , {$set: profileFields}, {new: true} )
                    .then( profile => res.json(profile));
            }else{
                //save new profile
                //check profile
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle alrady exists';
                            res.status(400).json(errors);
                        }

                        //save profile
                        new Profile(profileFields)
                            .save()
                            .then(profile => {
                                res.json(profile)
                            });
                    });
            }
        });
});


module.exports = router;