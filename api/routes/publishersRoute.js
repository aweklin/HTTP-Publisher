// dependency imports
const express = require('express');
const SubscribersController = require('../controllers/subscribersController');
const PublishersController = require('../controllers/publishersController');

// initialize router
const router = express.Router();

router.post('/subscribe/:topic', SubscribersController.subscribe);
router.get('/topics', PublishersController.get_all_topics);
router.post('/publish/:topic', PublishersController.publish_topic);

module.exports = router;