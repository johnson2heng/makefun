var express = require('express');
var router = express.Router();

var api = require('./controller/api');

router.post('/save_topics', api.save_topics);
router.post('/get_topics', api.get_topics);
router.post('/get_one_topic', api.get_one_topic);

router.post('/save_comments', api.save_comments);
router.post('/get_comments', api.get_comments);

router.post('/update_topic_laud', api.update_topic_laud);
router.post('/update_comment_laud', api.update_comment_laud);

module.exports = router;