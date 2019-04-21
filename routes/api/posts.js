const express = require('express');
const router = express.Router();
const passport = require('passport');


//load post model
const Post = require('../../models/Post');

//load profile model
const Profile = require('../../models/Profile');


//load post validation
const validationPostInput = require('../../validation/post');

// @route  GET api/Post/test
// @desc   Test Posrt Route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Posts It's Works " }));


// @route  GET api/Post
// @desc   Get all post
// @access public
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound: 'No Post found'}))
});


// @route  GET api/Posts/:id
// @desc   Get post by id
// @access public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound: 'No Post found'}))
});




// @route  GET api/Posts
// @desc   create new post
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validationPostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar
    });

    newPost.save().then(post => res.json(post));
});


//@route   Delete api/posts/:id
//@desc    delete post by id, and check if user.id === post.id
//@access  private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id} )
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
 
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({ noauthorized: 'User No Authorized ' });
                    }
                
                    // remove
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No Post Found' }));
        })
});



//@route   POST api/posts/like/:id
//@desc    like post , (id is post id!!)
//@access  private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id} )
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    const filterPost = post.likes.filter(like => like.user.toString() === req.user.id); //filter if user id already liked this post
                    if(filterPost.length > 0){
                        return res.status(400).json({ alreadylike: 'User already liked this post' });
                    }

                    //add user id to likes array
                    post.likes.unshift({ user: req.user.id });
                    //save
                    post.save().then(post => res.json(post));

                })
                .catch(err => res.status(404).json({ postnotfound: 'No Post found' }));
        });
});


//@route POST api/posts/unliked/:id
//@desc  unlike post by post id
//@access private
router.delete('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    const filterPost = post.likes.filter(like => like.user.toString() === req.user.id);
                    if(filterPost.length === 0){
                        return res.status(400).json({notliked: 'You have not yet liked this post'});
                    }

                    //get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id)

                    //splice
                    post.likes.splice(removeIndex, 1);

                    //save
                    post.save().then(post => res.json(post));
                });
        })
});

//@route POST api/posts/comment/:id
//@desc  post comment by post id
//@access private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}) , (req, res) => {
    const {errors, isValid} = validationPostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors)
    }

    Post.findById(req.params.id)
        .then(post => {
            const newCommen = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //add to comment array
            post.comments.unshift(newCommen);

            //save
            post.save().then(post => res.json(post));


        })
        .catch(err => res.status(400).json({postnotfound: 'No Post Found'}));
});

//@route DELETE api/posts/comment/:id/:comment_id
//@desc  delete comment
//@access private 
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {

    Post.findById(req.params.post_id)
        .then(post => {

            const filterComment = post.comments.filter(comment => comment._id.toString() === req.params.comment_id );
            if(filterComment.length === 0){
                return res.status(400).json({ commentnotexists: 'Comment does not exists' });
            }

            const removeIndex = post.comments
                .map(item =>  item._id.toString())
                .indexOf(req.params.comment_id)


            //splice comment out of array
            post.comments.splice(removeIndex, 1);

            //save
            post.save().then(post => res.json(post));

        })
        .catch(err => res.status(400).json({ comment: 'No Comment Found' }));

});












module.exports = router;