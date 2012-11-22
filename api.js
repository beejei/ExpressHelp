// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
var g = require('./global.js');									// Global variables, Definitions
var db = require('./db.js');									// DB Conenct Interface
var cmn = require('./common.js');								// Common Utilities

require('date-utils');											// npm install -g date-utils@1.2.12
var Hash = require('hash');										// npm install -g node_hash@0.2.0
var async = require('async');									// npm install -g async@0.1.22
var jade = require('jade');										// npm install -g jade@0.27.7
var Iconv = require('iconv').Iconv;								// npm install -g iconv@1.2.4

var fs = require('fs');											// File System
var util = require('util');
var exec = require('child_process').exec;
var md = require("node-markdown").Markdown;						// npm install -g node-markdown@0.1.1
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 

var hello_msg = ["Hello","안녕하세요","こんにちは。"];
var rotate = 0;


var Hello = function(req, res, cb) {
	var rv = {
		result : {
			ret : 'failure',
			msg : ''
		},
		data : {
		}
	};
	rv.data.msg = hello_msg[rotate++%3];
	rv.result.ret = 'success';
	console.log(rv);
	cb(rv);
}


function add_routes(app)
{
	app.get('/a/1.0/Hello?', function(req, res) {
		Hello(req, res, function(result){
			res.send(cmn.SafeToString(result));
		});
	});

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Web APIs
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Render API list
	app.get('/api?', function(req, res) {
		var html = md(fs.readFileSync('api.md.txt','utf8'),
				false,  // allow only HTML default sets
				"a|img",
				{
						"*":"title|style"               // 'title' and 'style' for all
				}
		);
		html = html.replace(/<pre>/gi,'<pre class="prettyprint linenums">');
		res.send(
			"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>\n" +
			"<html xmlns='http://www.w3.org/1999/xhtml'>\n" +
			"<head>\n" +
			"       <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>\n" +
			"       <link type='text/css' rel='stylesheet' href='/css/markdown.css'/>\n" +
			"       <link type='text/css' rel='stylesheet' href='/prettify/prettify.css'/>\n" +
			"       <link rel='shortcut icon' href='/favicon_lisnme.ico' type='image/x-icon'/>\n" +
			"       <title>Lisn.me API 일람</title>\n" +
			"       <script type='text/javascript' src='/js/json2.js'></script>\n" +
			"       <script type='text/javascript' src='/js/jquery.js'></script>\n" +
			"       <script type='text/javascript' src='/prettify/prettify.js'></script>\n" +
			"       <script type='text/javascript' src='/js/ajaxupload.js'></script>\n" +
			"       <script type='text/javascript'>\n" +
			"               jQuery(\n" +
			"                       function(){\n" +
			"                               new AjaxUpload('testupload', {\n" +
			"                                       action: '/a/v2/UploadProfileImage',\n" +
			"                                       name: 'profile_image',\n" +
			"                                       data: { index : 3 },\n" +
			"                                       onSubmit: function(file, extension){\n" +
			"                                       },\n" +
			"                                       onComplete: function(file, response){   // onComplete : 업로드 완료 후 호출\n" +
			"                                               if(/413 Request Entity Too Large/.test(response))\n" +
			"                                                       alert('5MB이하의 파일로 업로드해주세요');\n" +
			"                                               else\n" +
			"                                                       alert(response);\n" +
			"                                       }\n" +
			"                               });\n" +
			"                       }\n" +
			"               );\n" +
			"       </script>\n" +
			"</head>\n" +
			"<body onload='prettyPrint()'>\n" +
			html
			+ "</body>\n"
			+ "</html>\n"
		);
	});

};

module.exports.Hello = Hello;

module.exports.add_routes = add_routes;
