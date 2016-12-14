var page = 0;
var flag = false;
// 跳转到详情页面
function hrefLink(id) {
	var nickname = api['pageParam']['nickname'];
	var avatar = api['pageParam']['avatar'];
	var delay = 0;
	if("ios" != api.systemType) {
		delay = 300;
	}
	
	api.openWin({
		name: 'detail',
		url: './detail.html',
		pageParam: {
			topic_id: id,
			nickname: nickname,
			avatar: avatar
		},
		bounces: false,
        vScrollBarEnabled:false,
        hScrollBarEnabled:false,
        reload: true,
        delay: delay
	});
}

// 获取话题列表
function getData(page, callback) {
	api.ajax({
		url: config.dev_url + '/api/get_topics',
		method: 'post',
		data: {
			values: {
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
					str += '<div class="item"><a onclick="hrefLink(' + data.data[i].id + ')"><div class="avatar"><img src="../image/avatar/' + user_config[data.data[i].avatar].avatar + '" /></div>'
	                    + '<div class="content"><div class="head"><p class="title">' + data.data[i].nickname + '</p><p class="subtitle">' + data.data[i].create_time + '</p></div>'
	                    + '<div class="body"><p>' + (data.data[i].title == '' ? '' : '<span class="event">#' + data.data[i].title + '#</span>') + data.data[i].content + '</p></div>'
	                    + '<div class="foot"><ul class="pull-right"><li><span class="icon icon-comment"></span>评论<span>(' + data.data[i].comm_num + ')</span></li><li><span class="icon icon-laud"></span>赞<span>(' 
	                    + data.data[i].laud_num + ')</span></li></ul></div></div></a></div>';
				}
			}
			else {
				str = page == 0 ? '<p>还没有话题哦，快发布一个吧！</p>' : '<p>没有更多数据...</p>';
				flag = true;
			}
			$api.byId('topic_list').innerHTML = page == 0 ? str : $api.html($api.byId('topic_list')) + str;
			callback;
		}
		else {
			api.alert({ msg: JSON.stringify(err) });
		}
	});
}
apiready = function() {
	api.addEventListener({
		name: 'refresh'
	}, function(ret, err) {
		getData(0);
		$z.scrollToPos(0, 0);
	});
	getData(0);
	api.addEventListener({
	    name: 'scrolltobottom'
    },function(ret,err){
    	page = page + 1;
    	if(!flag) {
    		getData(page);
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
    	getData(0, api.refreshHeaderLoadDone());
    });
};