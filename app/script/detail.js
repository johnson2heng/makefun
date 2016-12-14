apiready = function(){
	var topic_id = api['pageParam']['topic_id'];
	var nickname = api['pageParam']['nickname'];
	var avatar = api['pageParam']['avatar'];
	$api.attr($api.byId('avatar'), 'data-avatar', avatar);
	$api.attr($api.byId('avatar'), 'src', '../image/avatar/' + user_config[avatar].avatar);
	$api.text($api.byId('nickname'), nickname);
	window.closeWin = function(winName) {
		api.closeWin();
	}
	var header = $api.byId('header');
    //适配iOS 7+，Android 4.4+状态栏
    $api.fixStatusBar(header);

    var headerPos = $api.offset(header);
    var main = $api.byId('detail');
    var mainPos = $api.offset(main);
    api.openFrame({
        name: 'detail',
        url: './content.html',
        pageParam: {
			topic_id: topic_id
		},
        bounces: true,
        rect: {
            x: 0,
            y: headerPos.h,
            w: 'auto',
            h: mainPos.h
        }
    });
	// 发表评论
	var cast_topic = $api.byId('cast-topic');
	var reply_name = '';
	var comm_id = '';
	// 监听评论事件
    api.addEventListener({
    	name: 'topic'
    }, function(ret, err) {
    	if(ret) {
    		var data = $api.strToJson(JSON.stringify(ret.value));
	    	if(data.title != '') {
	    		$api.val($api.byId('cast-con'), '#' + data.title + '#');
	    		reply_name = '#' + data.title + '#';
	    	}
    	}
    	else {
    		api.alert({ msg: JSON.stringify(err) });
    	}
    });
    // 监听回复事件
    api.addEventListener({
    	name: 'comment'
    }, function(ret, err) {
    	if(ret) {
    		var data = $api.strToJson(JSON.stringify(ret.value));
	    	if(data.title != '') {
	    		$api.val($api.byId('cast-con'), '@' + data.title);
	    		reply_name = '@' + data.title;
	    		if(data.comm_id != '') {
	    		alert('data.comm_id: ' + data.comm_id);
	    			comm_id = data.comm_id;
	    		}
	    	}
    	}
    	else {
    		api.alert({ msg: JSON.stringify(err) });
    	}
    });
	// 发布评论或回复
    $api.addEvt(cast_topic, 'click', function(){
    	var nickname = $api.text($api.byId('nickname'));
    	var avatar = $api.attr($api.byId('avatar'),'data-avatar');
    	var cast_con = $api.val($api.byId('cast-con'));
    	if(cast_con.replace(/\s/g, "") == '') {
    		api.toast({
			    msg: '请输入评论内容',
			    duration: 2000,
			    location: 'bottom'
			});
    		return;
    	}
    	var content = $z.getTopicCon(cast_con).content;
    	content = content.indexOf(reply_name) > -1 ? content.substring(reply_name.length, content.length) : content;
    	api.ajax({
			url: config.dev_url + '/api/save_comments',
			method: 'post',
			data: {
				values: {
					topic_id: topic_id,
					nickname: nickname,
				  	avatar: avatar,
				  	content: content,
				  	reply_name: reply_name,
				  	comm_id: comm_id,
				  	create_time: $z.formatTime(new Date())
				}
			},
			dataType: 'json'
		}, function(ret, err) {
			if(ret) {
				var data = $api.strToJson(JSON.stringify(ret));
				if(data.success == 1) {
					if(reply_name.indexOf('@') > -1) {
						api.toast({
						    msg: '回复成功！',
						    duration: 2000,
						    location: 'middle'
						});
						$api.val($api.byId('cast-con'), '');
						
					}
					else {
						api.toast({
						    msg: '评论发布成功！',
						    duration: 2000,
						    location: 'middle'
						});
						$api.val($api.byId('cast-con'), reply_name);
					}
					api.sendEvent({
						name: 'refresh'
					});
				}
				else {
					api.toast({
					    msg: '网络错误，请重试！',
					    duration: 2000,
					    location: 'middle'
					});
				}
			}
			else {
				api.alert({ msg: JSON.stringify(err) });
			}
		});
	});
};