// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
var g = require('./global.js');									// Global variables, Definitions
var db = require('./db.js');									// DB Connect Interface
var cmn = require('./common.js');								// Common Utilities

require('date-utils');											// npm install -g date-utils@1.2.12
var Hash = require('hash');										// npm install -g node_hash@0.2.0
var async = require('async');									// npm install -g async@0.1.22
var jade = require('jade');										// npm install -g jade@0.27.7
var Iconv = require('iconv').Iconv;								// npm install -g iconv@1.2.4

var fs = require('fs');											// File System
var util = require('util');
var exec = require('child_process').exec;
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
var api = require('./api');


function add_routes(app)
{
	app.get('/say/hello', function(req, res) {
		// Call APIs Internally
		api.Hello(req,res,function(result){
			res.send('Everyone '+ result.data.msg);
		});
	});
	
	// File Download with Nginx internal redirect
	app.get('/mp3/download', function(req, res) {
		res.header('X-Accel-Redirect', '/storage/9727803_320.mp3');
		res.writeHead(200,{'Content-Type':'audio/mpeg'});
		res.end();
	});

	// get method euc-kr parse test
	app.get('/euc-kr-get', function(req, res) {
		res.send("내이름은 "+req.query.name);
	});

	// post method euc-kr parse test
	app.post('/euc-kr-post', function(req, res) {
		res.send("내이름은 "+req.body.name);
	});

	// file upload test
	app.post('/upload', function(req, res) {
		var html = '';
		if(req.files && req.files.userfile) {
			if(req.files.userfile.toString() !== '[object Object]' && req.files.userfile[0].length>0) {
				var item = req.files.userfile[0];
				for(var i in req.files.userfile[0]) {
					//console.log(req.files.userfile[i]);
					html += 'File Name : ' + item[i].name + '\n';
					html += 'File Size : ' + item[i].size + '\n';
					html += 'File Type : ' + item[i].type + '\n';
					html += 'Stored Path : ' + item[i].path + '\n';
				}
			} else {
				//console.log(req.files.userfile);
				html += 'File Name : ' + req.files.userfile.name + '\n';
				html += 'File Size : ' + req.files.userfile.size + '\n';
				html += 'File Type : ' + req.files.userfile.type + '\n';
				html += 'Stored Path : ' + req.files.userfile.path + '\n';
			}
		}
		res.send(html);
	});


	// file upload progress test
	app.get('/uploadprogress?',  function(req, res) {
		if(g.UPLOADPROGRESS[req.sessionID])
		{
			res.send(g.UPLOADPROGRESS[req.sessionID]);
			if(Number(g.UPLOADPROGRESS[req.sessionID])===100)
				delete g.UPLOADPROGRESS[req.sessionID];
		} else
			res.send('100');
	});

};

module.exports.add_routes = add_routes;
