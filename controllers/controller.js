const express = require('express');

const router = express.Router();

router.use('/api/v1/meetups', require('./meetupController'));
router.use('/api/v1/meetups/:meetup_id/questions', require('./questionController'));
router.use('/api/v1/auth', require('./userController'));

router.use(function (req, res) {
  res.json({ status: 404, error: 'Invalid URL' });
});

module.exports = router;
