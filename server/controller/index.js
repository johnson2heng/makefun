// 首页
exports.index = function(req, res, next) {
	res.render('index', {
		title: '匿名吐槽'
	});
};
// 话题详情
exports.detail = function(req, res, next) {
	res.render('detail', {
		title: '匿名吐槽'
	});
};