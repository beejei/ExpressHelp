var express = require('express@custom');						// npm install -g express@3.0.3
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
var g = require('./global.js');									// Global variables, Definitions
var db = require('./db.js');									// DB Conenct Interface
var cmn = require('./common.js');								// Common Utilities

require('date-utils');											// npm install -g date-utils@1.2.12
var Hash = require('hash');										// npm install -g node_hash@0.2.0
var async = require('async');									// npm install -g async@0.1.22
var jade = require('jade');										// npm install -g jade@0.27.7
var Iconv = require('iconv').Iconv;								// npm install -g iconv@1.2.4
var redis = require('connect-redis')(express);					// npm install -g connect-redis@1.4.5
var _ = require('underscore');									// npm install -g underscore@1.4.2

var fs = require('fs');										// File System
var util = require('util');
var exec = require('child_process').exec;
var os = require('os');
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 


// all environments
app.configure(function(){
	app.set('port', /*process.env.PORT || */8000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('case sensitive routes', true);

	// Middlewares
	app.use(express.favicon());					// Express Default favicon
	app.use(express.logger('dev'));
	//app.use(express.methodOverride());		// Support PUT, DELETE
	app.use(express.cookieParser('secret_NODECONF'));
	app.use(express.session({store : new redis({ host : '172.31.0.54', db : 4 })}));
	app.use(express.bodyParser({
		limit : 10*1024*1024,
		keepExtensions: true, 
		uploadDir: path.join(__dirname, 'uploaded'),
		fn_progress : function(req, bytesReceived, bytesExpected) {
			g.UPLOADPROGRESS[req.sessionID] = String(parseFloat(parseFloat(bytesReceived)*100/parseFloat(bytesExpected)).toFixed(2));
			console.log(g.UPLOADPROGRESS[req.sessionID]);
		}
	}));
	app.use(cmn.AuthCheck());
	//app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// production only
app.configure('production', function() {
	app.use(express.errorHandler({}));
});



// Global Exception Handler
process.on('uncaughtException', function (err) {
	util.log('[UNCAUGHT EXCEPTION]___________report_start');
	util.log('[Stack]\n'+err.stack);
	util.log('[Arguments] : '+err.arguments);
	util.log('[Type] : '+err.type);
	util.log('[Message] : '+err.message);
	util.log('[UNCAUGHT EXCEPTION]___________report_end');
	process.exit(1);	// <-- leave her die
});











console.log('----');
console.log('Machine name: ' + os.hostname());
console.log('CPU: ' + os.cpus()[0].model + ' ' + os.cpus().length + 'core '+ os.arch() + ' ' + os.cpus()[0].speed + ' Mhz');
console.log('OS: ' + os.type() + ' ' + os.release());
console.log('process.platform: ' + process.platform);
console.log('process.pid: ' + process.pid);
console.log('----');
console.log('versions.node: ' + process.versions.node);
console.log('versions.v8: ' + process.versions.v8);
console.log('versions.ares: ' + process.versions.ares);
console.log('versions.uv: ' + process.versions.uv);
console.log('versions.http_parser: ' + process.versions.http_parser);
console.log('versions.zlib: ' + process.versions.zlib);
console.log('versions.openssl: ' + process.versions.openssl);
console.log('----');

// Display setted values
var keys = ['env ','port','views','view engine','view cache','case sensitive routes','trust proxy',
			'jsonp callback name','json replacer','json spaces','strict routing'];
for(var i in keys)
	console.log('Express SET '+keys[i]+' = '+app.get(keys[i]));


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
g.VIEWDIR = app.get('views');


// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

//app.get('/', routes.index);
app.get('/', function(req, res){
	if(req.AuthResult.length>0)
		res.redirect('/loginform');
	else
		cmn.Render(res,'index',{
		});
});

app.get('/loginform', function(req, res){
	cmn.Render(res,'loginform',{
	});
});

app.get('/login', function(req, res){
	cmn.InternalLogin(req,res,function(req,res,result){
		if(result){
			console.log('true');
			cmn.MakeUpSession(req,res,function(req,res){
				res.redirect('/');
			});
		}
	});
});

app.get('/logout', function(req, res){
	cmn.ClearSession(req,res);
	res.redirect('/');
});

require('./api').add_routes(app);		// API Routes
require('./subroute').add_routes(app);	// Sub Routes

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


// Jade Precompile
if(!g.DEVELOPMENT)
	cmn.JadePrecompile(path.join(__dirname, 'views'),function(){
		console.log("Jade PreCompile DONE=============");
	});
