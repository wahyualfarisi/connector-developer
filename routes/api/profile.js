const express = require('express');
const router = express.Router();


// @route  GET api/profile/test
// @desc   Test Profile Route
// @access public
router.get('/test', (req, res) => res.json({ msg: "It's Works " }));

module.exports = router;