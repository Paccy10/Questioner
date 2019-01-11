const express = require('express');

const router = express.Router();

router.use('/api/v1/meetups', require('./meetupController'));
router.use('/api/v1/questions', require('./questionController'));

module.exports = router;
