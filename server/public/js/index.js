$(function(){
    // getTopicCon('#3333#11111');
    // function getTopicCon(str) {
    //     var _str = str.trim();
    //     if(_str.indexOf('#') == 0) {
    //         var _2 = _str.substring(1, _str.length).indexOf('#');
    //         if(_2 > -1) {
    //             return {
    //                 topic: _str.substring(1, _2),
    //                 content: _str.substring(_2+1, _str.length)
    //             }
    //         }
    //     }
    //     return {
    //         topic: '',
    //         content: _str
    //     }
    // }
	// 获取话题列表
	// $.ajax({
     //    url: 'http://localhost:3000/api/get_topics',
     //    type: 'post',
     //    data: {
     //        start_index: '0',
     //        page: '20'
     //    },
     //    success: function (result) {
     //    	console.log(result);
     //        if(typeof result=='string'){
     //            result=JSON.parse(result);
     //        }
     //        var str = '';
     //        $.each(result.data, function (i, v) {
     //            str += '<div class="item"><a href="/detail?topic_id=' + v.id + '"><div class="avatar"><img src="' + v.avatar + '" /></div>'
     //                + '<div class="content"><div class="head"><p class="title">' + v.nickname + '</p><p class="subtitle">' + v.create_time + '</p></div>'
     //                + '<div class="body"><p><span class="event">#' + v.title + '#</span>' + v.content + '</p></div>'
     //                + '<div class="foot"><ul class="pull-right"><li><span class="icon icon-comment"></span>评论<span>(' + v.comm_num + ')</span></li><li><span class="icon icon-laud"></span>赞<span>(' + v.laud_num + ')</span></li></ul></div></div></a></div>';
     //        });
     //        $('#topic_list').html(str);
     //    },
     //    fail: function (result) {
     //        console.log(result);
     //    }
    // });
    // // 发表话题
    // $('#tocast').on('click', function () {
     //    $.ajax({
     //        url: 'http://localhost:3000/api/save_topics',
     //        type: 'post',
     //        data: {
     //            nickname: 'test',
     //            avatar: 5,
     //            title: 'just test',
     //            content: 'I am just a test',
     //            create_time: '20161015'
     //        },
     //        success: function (result) {
     //            console.log(result);
     //            if(typeof result=='string'){
     //                result=JSON.parse(result);
     //            }
     //        },
     //        fail: function (result) {
     //            console.log(result);
     //        }
     //    });
    // });
    // 测试回复接口
       $.ajax({
           url: 'http://localhost:3014/api/save_comments',
           type: 'post',
           data: {
               topic_id: 1,
               nickname: 'test',
               avatar: 5,
               content: 'I am just a test',
               reply_name: 'dedede',
               comm_id: '2',
               create_time: '20161015'
           },
           success: function (result) {
               console.log(result);
               if(typeof result=='string'){
                   result=JSON.parse(result);
               }
           },
           fail: function (result) {
               console.log(result);
           }
       });
});
