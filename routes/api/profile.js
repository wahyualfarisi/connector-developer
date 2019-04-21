const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load validateprofileinput 
const validateprofileinput = require('../../validation/profile');
//load validateExperienceinput
const validateExperienceinput = require('../../validation/experience');
//load validateEducationInput
const validateEducationInput = require('../../validation/education');

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











// @route  GET api/profile/handle/:handle
// @desc   get profile by handle
// @access public
router.get('/handle/:handle', ( req, res ) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name','avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});






//@route  GET api/profile/user/user_id
//#desc   get profile by user_id
//@access public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name','avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is No Profile';
                res.status(404).json(erros);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'})) 
});








//@route  GET api/profile/all
//#desc   get all profile
//@access public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name','avatar'] )
        .then( profile => {
            if(!profile){
                errors.profile = 'There is no profile';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({profile: 'there is no profile for this user'}))
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
    Profile.findOne({ user: req.user._id })
        .then( profile => {
            if(profile){
                //update data
                Profile.findOneAndUpdate( {user: req.user.id} , {$set: profileFields}, {new: true} )
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






// @route  POST api/profile/experience
// @desc   add experience
// @access private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateExperienceinput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        })
});

// @route  POST api/profile/experience
// @desc   add experience
// @access private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors , isValid } = validateEducationInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }
            profile.education.unshift(newEducation);
            profile.save().then( profile => res.json(profile) );
        });
});


// @route  DELETE api/profile/experience/:exp_id
// @desc   delete experience from profile
// @access private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}) , (req, res) => {
    // const errors = {};
    // Profile.findOne({ user: req.user.id })
    //     .then(profile => {
    //         if(!profile) {
    //             errors.experience = 'No Experience';
    //             return res.status(404).json(errors);
    //         }
    //     })
})





module.exports = router;