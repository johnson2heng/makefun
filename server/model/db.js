var mysql = require('mysql');

var pool = mysql.createPool({
    host:"115.29.248.111",
    port:3306,
    database:"makefun",
    user:"makefun",
    password:"EpnzII2h1J3Z6m0A"
});

var db_query = function(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals,fields);
            });
        }
    });
};

module.exports = db_query;