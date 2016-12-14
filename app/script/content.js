var page = 0;
var flag = false;
// 获取评论列表
/**
 * getData
 * @param {Object} topic_id	话题id
 */
function getData(topic_id, page, callback) {
	api.ajax({
		url: config.dev_url + '/api/get_comments',
		method: 'post',
		data: {
			values: {
				topic_id: topic_id,
				start_index: page,
				page: 20
			}
		},
		dataType: 'json'
	}, function(ret, err) {
		if(ret) {
			var data = $api.strToJson(JSON.stringify(ret));
			var str = '';
			if(data.success == 1) {
				for(var i =  0;  i < data.data.length; ++i) {
					str += '<div class="item"><div class="avatar"><img src="../image/avatar/' + user_config[data.data[i].avatar].avatar + '" /></div>'
                    + '<div class="content"><div class="head"><p class="title">' + data.data[i].nickname + (data.data[i].reply_name.indexOf('@') > -1 ? ' 回复 ' : ' 评论了') + ' <span class="event">' + data.data[i].reply_name 
                    + '</span></p><p class="subtitle">' + data.data[i].create_time + '</p></div>'
                    + '<div class="body"><p>' + data.data[i].content + '</p></div>'
                    + '<div class="foot"><ul class="pull-right"><li data="' + data.data[i].nickname + '" id="comment-' + data.data[i].id + '" onclick="reply_comment(' + data.data[i].id + ')"><span class="icon icon-comment"></span>回复<span>(' + data.data[i].comm_num 
                    + ')</span></li><li onclick="comment_laud('+ data.data[i].id +')"><span class="icon icon-laud"></span>赞<span>(' 
                    + data.data[i].laud_num + ')</span></li></ul></div></div></div>';
                }
			}
			else {
				str = page == 0 ? '<p>还没人评论，快抢沙发评论吧！</p>' : '<p>没有更多数据...</p>';
				flag = true;
			}
            $api.byId('comment').innerHTML = page == 0 ? str : $api.html($api.byId('comment')) + str;
            callback;
		}
		else {
			alert('getData');
			api.alert({ msg: JSON.stringify(err) });
		}
	});
}
// 获取话题详情
/**
 * getOneTopic
 * @param {Object} topic_id 	话题id
 * @param {Object} ename 	发送事件名称
 */
function getOneTopic(topic_id, ename) {
	api.ajax({
		url: config.dev_url + '/api/get_one_topic',
		method: 'post',
		data: {
			values: {
				topic_id: topic_id
			}
		},
		dataType: 'json'
	}, function(ret, err) {
		if(ret) {
			var data = $api.strToJson(JSON.stringify(ret));
			var topic_title = "'" + data.data[0].title + "'";
			var str = '<div class="avatar"><img src="../image/avatar/' + user_config[data.data[0].avatar].avatar + '" /></div>'
                + '<div class="content"><div class="head"><p class="title">' + data.data[0].nickname + '</p><p class="subtitle">' + data.data[0].create_time + '</p></div>'
                + '<div class="body"><p>' + (data.data[0].title == '' ? '' : '<span class="event" id="topic-title">#' + data.data[0].title + '#</span>') + data.data[0].content + '</p></div>'
                + '<div class="foot"><ul class="pull-right"><li onclick="topic_comment(' + topic_title +  ');"><span class="icon icon-comment"></span>评论<span>(' + data.data[0].comm_num + ')</span></li><li onclick="topic_laud(' + data.data[0].id + ');"><span class="icon icon-laud"></span>赞<span>(' 
                + data.data[0].laud_num + ')</span></li></ul></div></div>';
            $api.byId('topic-con').innerHTML = str;
            if(ename) {
            	api.sendEvent({
	            	name: ename,
	            	extra: {
	            		'title': data.data[0].title
	            	}
	            });
            }
		}
		else {
			alert('getOneTopic');
			api.alert({ msg: JSON.stringify(err) });
		}
	});
}
// 话题点赞
/**
 * topic_laud
 * @param {Object} topic_id 	话题id
 */
function topic_laud(topic_id) {
	api.ajax({
		url: config.dev_url + '/api/update_topic_laud',
		method: 'post',
		data: {
			values: {
				topic_id: topic_id
			}
		},
		dataType: 'json'
	}, function(ret, err) {
		if(ret) {
			api.sendEvent({
				name: 'refresh'
			});
		}
		else {
			api.alert({ msg: JSON.stringify(err) });
		}
	});
}
// 话题评论
/**
 * topic_comment
 * @param {Object} title
 */
function topic_comment(title) {
	api.sendEvent({
		name: 'topic',
		extra: {
			title: title
		}
	});
}
// 评论点赞
/**
 * comment_laud
 * @param {Object} comm_id
 */
function comment_laud(comm_id) {
	api.ajax({
		url: config.dev_url + '/api/update_comment_laud',
		method: 'post',
		data: {
			values: {
				comm_id: comm_id
			}
		},
		dataType: 'json'
	}, function(ret, err) {
		if(ret) {
			api.sendEvent({
				name: 'refresh'
			});
		}
		else {
			api.alert({ msg: JSON.stringify(err) });
		}
	});
}
// 评论回复
/**
 * reply_comment
 * @param {Object} id	评论计数
 */
function reply_comment(id) {
	api.sendEvent({
		name: 'comment',
		extra: {
			title: $api.attr($api.byId('comment-' + id), 'data'),
			comm_id: id
		}
	});
}
apiready = function() {
	var topic_id = api['pageParam']['topic_id'];
	getOneTopic(topic_id, 'topic');
	api.addEventListener({
		name: 'refresh'
	}, function(ret, err) {
		getData(topic_id, 0);
		getOneTopic(topic_id);
		$z.scrollToPos(0, 0);
	});
	getData(topic_id, 0);
	api.addEventListener({
	    name: 'scrolltobottom'
    },function(ret,err){
    	page = page + 1;
    	if(!flag) {
    		getData(topic_id, page);
    	}
    });
    api.setRefreshHeaderInfo({
    	visible: true,
    	loadingImg: 'widget://image/refresh.png',
    	bgColor: '#ccc',
	    textColor: '#fff',
	    textDown: '下拉刷新...',
	    textUp: '松开刷新...',
	    showTime: true
    },function(ret,err){
    	api.refreshHeaderLoading();
    	getData(topic_id, 0, api.refreshHeaderLoadDone());
    });
};