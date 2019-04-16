const express = require('express');
const router = express.Router();

// @route  GET api/Users/test
// @desc   Test Users Route
// @access public
router.get('/test', (req, res) => res.json({ msg: "Users It's Works " }));

module.exports = router;