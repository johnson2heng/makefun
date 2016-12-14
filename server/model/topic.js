var util = require('util');
var db_query = require('./db');

// 发表话题
/**
 * save_topics
 * @param {Object} data
 * {
 * 		nickname,	// 匿名名称
 * 		avatar,		// 头像索引
 * 		title,		// 话题标题
 * 		content,	// 话题内容
 * 		create_time	// 发布时间
 * }
 * @param {Object} success
 * @param {Object} fail
 */
exports.save_topics = function(data, success, fail) {
	var str = util.format("INSERT INTO topics(nickname, avatar, title, content, create_time) VALUES('%s', '%d', '%s', '%s', '%s')", data.nickname, data.avatar, data.title, data.content, data.create_time);
	db_query(str, function(err, rows, fields) {
		if(err) throw err;
		var qstr = util.format("SELECT * FROM topics WHERE create_time = '%s'", data.create_time);
		db_query(qstr, function(err, rows, fields) {
			rows.length > 0 ? success(rows[0]) : fail();
		});
	});
};
// 获取话题列表
/**
 * get_topics
 * @param {Object} data
 * {
 * 		start_index,	// 查询起始页
 * 		page			// 分页条数
 * }
 * @param {Object} success
 * @param {Object} fail
 */
exports.get_topics = function(data, success, fail) {
	var str = util.format(
		"SELECT DISTINCT id, nickname, avatar, title, content, comm_num, laud_num, create_time FROM topics ORDER BY create_time DESC LIMIT %d, %d",
		data.start_index * data.page, data.page);
	db_query(str, function(err, rows, fields) {
		if(err) throw err;
		rows.length > 0 ? success(rows) : fail();
	});
};
// 获取话题详情
/**
 * get_one_topic
 * @param data
 * {
 *      topic_id,	// 话题id
 * }
 * @param success
 * @param fail
 */
exports.get_one_topic = function(data, success, fail) {
	var str = util.format(
		"SELECT DISTINCT id, nickname, avatar, title, content, comm_num, laud_num, create_time FROM topics WHERE id = %d",
		data.topic_id);
	db_query(str, function(err, rows, fields) {
		if(err) throw err;
		rows.length > 0 ? success(rows) : fail();
	});
};
// 发表评论
/**
 * save_comments
 * @param {Object} data
 * {
 * 		topic_id,	// 话题id
 * 		nickname,	// 匿名名称
 * 		avatar, 	// 头像索引
 * 		content,	// 评论内容
 * 		reply_name,	// 被回复者昵称
 * 		create_time,// 评论时间
 * }
 * @param {Object} success
 * @param {Object} fail
 */
exports.save_comments = function(data, success, fail) {
	var str = util.format("INSERT INTO comments(topic_id, nickname, avatar, content, reply_name, create_time) VALUES('%d', '%s', '%d', '%s', '%s', '%s')", data.topic_id, data.nickname, data.avatar, data.content, data.reply_name, data.create_time);
	db_query(str, function(err, rows, fields) {
		if(err) throw err;
		var qstr = util.format("SELECT * FROM comments WHERE create_time = '%s'", data.create_time);
		db_query(qstr, function(err, rows, fields) {
			if(err) throw err;
			if(rows.length > 0) {
				var ustr = util.format("UPDATE topics SET comm_num = comm_num + 1 WHERE id = %d", data.topic_id);
				db_query(ustr, function(err, rows, fields) {
					if(err) throw err;
				});
                if(data.comm_id != '') {
                    var cstr = util.format("UPDATE comments SET comm_num = comm_num + 1 WHERE id = %d", data.comm_id);
                    db_query(cstr, function(err, rows, fields) {
                        if(err) throw err;
                    });
                }
				success(rows[0]);
			}
			else {
				fail();
			}
		});
	});
};
// 获取评论列表
/**
 * get_comments
 * @param {Object} data
 * {
 * 		topic_id,		// 话题id
 * 		start_index,	// 查询起始页
 * 		page			// 分页条数
 * }
 * @param {Object} success
 * @param {Object} fail
 */
exports.get_comments = function(data, success, fail) {
	var str = util.format("SELECT DISTINCT id, nickname, avatar, content, reply_name, comm_num, laud_num, create_time FROM comments WHERE topic_id = '%d' ORDER BY create_time DESC LIMIT %d, %d",
	data.topic_id, data.start_index * data.page, data.page);
	db_query(str, function(err, rows, fields) {
		if(err) throw err;
		rows.length > 0 ? success(rows) : fail();
	});
};
// 话题点赞
/**
 * update_topic_laud
 * @param {Object} data
 * {
 * 		topic_id	// 话题id
 * }
 * @param {Object} success
 * @param {Object} fail
 */
exports.update_topic_laud = function(data, success, fail) {
	var str = util.format("UPDATE topics SET laud_num = laud_num + 1 WHERE id = '%d'", data.topic_id);
	db_query(str, function(err, rows, fields) {
		if(err) throw err;
		rows.length > 0 ? success(rows) : fail();
	});
};
// 评论点赞
/**
 * update_comment_laud
 * @param {Object} data
 * {
 * 		comm_id	// 话题id
 * }
 * @param {Object} success
 * @param {Object} fail
 */
exports.update_comment_laud = function(data, success, fail) {
	var str = util.format("UPDATE comments SET laud_num = laud_num + 1 WHERE id = '%d'", data.comm_id);
	db_query(str, function(err, rows, fields) {
		if(err) throw err;
		rows.length > 0 ? success(rows) : fail();
	});
};