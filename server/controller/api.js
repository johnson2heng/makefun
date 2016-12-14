var model_topic = require('../model/topic');

// 发表话题
exports.save_topics = function(req, res, next) {
	model_topic.save_topics(
		req.body,
		function success(data) {
			res.end(JSON.stringify({success:1, data:data}));
		},
		function fail(){
            res.end(JSON.stringify({success:0}));
        });
};
// 获取话题列表
exports.get_topics = function(req, res, next) {
	model_topic.get_topics(
		req.body,
		function success(data) {
			res.end(JSON.stringify({success:1, data:data}));
		},
		function fail(){
            res.end(JSON.stringify({success:0}));
        });
};
// 获取话题详情
exports.get_one_topic = function(req, res, next) {
	model_topic.get_one_topic(
		req.body,
		function success(data) {
			res.end(JSON.stringify({success:1, data:data}));
		},
		function fail(){
			res.end(JSON.stringify({success:0}));
		});
};
// 发表评论
exports.save_comments = function(req, res, next) {
	model_topic.save_comments(
		req.body,
		function success(data) {
			res.end(JSON.stringify({success:1, data:data}));
		},
		function fail(){
            res.end(JSON.stringify({success:0}));
        });
};
// 获取评论列表
exports.get_comments = function(req, res, next) {
	model_topic.get_comments(
		req.body,
		function success(data) {
			res.end(JSON.stringify({success:1, data:data}));
		},
		function fail(){
            res.end(JSON.stringify({success:0}));
        });
};
// 话题点赞
exports.update_topic_laud = function(req, res, next) {
	model_topic.update_topic_laud(
		req.body,
		function success(data) {
			res.end(JSON.stringify({success:1, data:data}));
		},
		function fail(){
            res.end(JSON.stringify({success:0}));
        });
};
// 评论点赞
exports.update_comment_laud = function(req, res, next) {
	model_topic.update_comment_laud(
		req.body,
		function success(data) {
			res.end(JSON.stringify({success:1, data:data}));
		},
		function fail(){
            res.end(JSON.stringify({success:0}));
        });
};