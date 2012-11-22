var mysql = require('mysql');				// npm install -g mysql@2.0.0-alpha4

var DB = function(){
	var me = this;
	me.db = null;
	function reconnect(){
		me.db = mysql.createConnection({ 
			host : "ip address here",
			port : 3333,
			user : "username here",
			password : "password here",
			database : "dbname here"
		});

		me.db.connect(function(err){
			console.log('mysql db connect :'+JSON.stringify(err));
			if(!err){
				me.db.query('SET group_concat_max_len=20000');
			}
		});

		// Node의 기본 Error Handler, 여기서는 exception만 만아주는 역할을 한다
		me.db.on('error', function(err) {
			console.log('MYSQL : Connection may have a FATAL Problem...');
		});
		// Connection이 끊겼을 경우의 처리
		me.db.on('close', function(err) {
			if (err) {
				console.log('MYSQL ERR : '+JSON.stringify(err));
			}
			console.log('MYSQL : Server closed the Connection. Reconnect...');
			setTimeout(function(){
				reconnect();
			},500);
		});
	}
	reconnect();
	me.query = function(query,params,cb){
		// Query Middleware
		me.db.query(query,params,cb);
	}
}

module.exports = new DB;

// INSERT 이후 callback
//	function(err, results){
//		results.affectedRows
//		results.insertId
//		results.serverStatus
//		results.warningCount
//		results.message
