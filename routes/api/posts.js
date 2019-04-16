const express = require('express');
const router = express.Router();

// @route  GET api/Post/test
// @desc   Test Posrt Route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Posts It's Works " }));

module.exports = router;