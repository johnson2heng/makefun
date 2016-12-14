apiready = function(){
	// 随机头像和匿名身份
	var uid = $z.randByTime(user_config.length);
	var did = $z.randByArray(desc_config.length);
	var user_info = {};
	$z.setUserInfo(user_info, user_config, uid, desc_config, did);
	// 设置头像和匿名昵称
	$api.attr($api.byId('avatar'), 'data-avatar', user_info.uid);
	$api.attr($api.byId('avatar'), 'src', './image/avatar/' + user_info.avatar);
	$api.text($api.byId('nickname'), user_info.nickname);
	
	var header = $api.byId('header');
    //适配iOS 7+，Android 4.4+状态栏
    $api.fixStatusBar(header);

    var headerPos = $api.offset(header);
    var main = $api.byId('main');
    var mainPos = $api.offset(main);
    api.openFrame({
        name: 'main',
        url: 'html/main.html',
        pageParam: {
			nickname: user_info.nickname,
			avatar: user_info.uid
		},
        bounces: true,
        rect: {
            x: 0,
            y: headerPos.h,
            w: 'auto',
            h: mainPos.h
        }
    });
   	//发布话题
    var cast_topic = $api.byId('cast-topic');
    $api.addEvt(cast_topic, 'click', function(){
    	var nickname = $api.text($api.byId('nickname'));
    	var avatar = $api.attr($api.byId('avatar'),'data-avatar');
    	var cast_con = $api.val($api.byId('cast-con'));
    	if(cast_con.replace(/\s/g, "") == '') {
    		api.toast({
			    msg: '请输入话题，格式：#吐槽话题# 吐槽内容！',
			    duration: 2000,
			    location: 'bottom'
			});
    		return;
    	}
    	var title = $z.getTopicCon(cast_con).topic;
    	var content = $z.getTopicCon(cast_con).content;
    	api.ajax({
			url: config.dev_url + '/api/save_topics',
			method: 'post',
			data: {
				values: {
					nickname: nickname,
				  	avatar: avatar,
				  	title: title,
				  	content: content,
				  	create_time: $z.formatTime(new Date())
				}
			},
			dataType: 'json'
		}, function(ret, err) {
			if(ret) {
				var data = $api.strToJson(JSON.stringify(ret));
				if(data.success == 1) {
					api.sendEvent({
						name: 'refresh'
					});
					$api.val($api.byId('cast-con'), '');
					api.toast({
					    msg: '话题发布成功！',
					    duration: 2000,
					    location: 'middle'
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