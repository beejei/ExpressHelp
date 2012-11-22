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
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 


var date = new Date();							// 현재 시간(서버기준)
var conv = new Iconv('UTF-8','EUC-KR');

// $ openssl enc -aes-256-cbc -k secret -P -md sha1
// salt=4A62A0774B863DC2
// key=6B829260D220C9C2092BDD3C7ECB0A03A43D90E4740C62B26790D6FA84868B3D
// iv =0BE59E5FB4AB593D5B997EDFB0116793
var crypto = require('crypto');					// Crypt library
var cryptkey = new Buffer([0x6B,0x82,0x92,0x60,0xD2,0x20,0xC9,0xC2,0x09,0x2B,0xDD,0x3C,0x7E,0xCB,0x0A,0x03,0xA4,0x3D,0x90,0xE4,0x74,0x0C,0x62,0xB2,0x67,0x90,0xD6,0xFA,0x84,0x86,0x8B,0x3D]);
var iv = new Buffer([0x0B,0xE5,0x9E,0x5F,0xB4,0xAB,0x59,0x3D,0x5B,0x99,0x7E,0xDF,0xB0,0x11,0x67,0x93]);
var bcrypt = require('bcrypt');									// npm install -g bcrypt@0.7.3

var GR = function(){
	this.result = {
		ret : 'failure',
		msg : ''
	};
	this.data = {};
};



// sprintf 처럼 포맷팅된 문자열 만들기
// @author Hooriza
// @version 0.9 May 5, 2007
// @see <a href="http://blog.hooriza.com/1164">간단한 설명</a>
var string_repeat = String.prototype.repeat = function(n) {
  var sRet = "";
  for (var i = 0; i < n; i++) sRet += this;
  return sRet;
}

var string_format = String.prototype.format = function(/* ... */) {

  var args = arguments;
  var idx = 0;

  return this.replace(/%(-?)([0-9]*\.?[0-9]*)([s|f|d|x|X|o])/g, function(all, sign, format, type) {

    var arg;
    var prefix = format.charAt(0);

    format = format.split(/\./);

    format[0] = parseInt(format[0], 10) || 0;
    format[1] = format[1] === undefined ? NaN : parseInt(format[1], 10) || 0;

    if (type == 's') {
      arg = isNaN(format[1]) ? args[idx] : args[idx].substr(0, format[1]);
    } else {

      if (type == 'f') {
        arg = (format[1] === 0 ? parseInt(args[idx], 10) : parseFloat(args[idx])).toString();
        if (!isNaN(format[1])) arg = arg.replace(RegExp('(\\.[0-9]{' + format[1] + '})[0-9]*'), '$1');
      } else if (type == 'd') {
        arg = parseInt(args[idx], 10).toString();
      } else if (type == 'x') {
        arg = parseInt(args[idx], 10).toString(16).toLowerCase();
      } else if (type == 'X') {
        arg = parseInt(args[idx], 10).toString(16).toUpperCase();
      } else if (type == 'o') {
        arg = parseInt(args[idx], 10).toString(8);
      }

      if (prefix == '0')  arg = '0'.repeat(format[0] - arg.length) + arg;

    }

    if (sign == '-') {
      arg += ' '.repeat(format[0] - arg.length);
    } else {
      arg = ' '.repeat(format[0] - arg.length) + arg;
    }

    idx++;
    return arg;

  }).replace(/%%/g, '%');

}


// Precompile All JADE
var JadePrecompile = function(dir,callback) {
	fs.readdir(dir,function(err,files){
		//util.log(util.format('%j',files));
		var funcs = [];
		var p = 0;
		for(var i in files)
		{
			funcs[i] = function(cb){
				var filename = dir+'/'+files[p++];
				//util.log(filename+'\t[test]');
				fs.lstat(filename, function(err,stats){
					if(stats.isDirectory())
					{
						//util.log(filename+'\t[dir]');
						JadePrecompile(filename,function(){
							cb(null,0);
						});
					} else if(stats.isFile()) {
						//util.log(filename+'\t[file]');
						// get jade path
						var jadename = String(filename);
						jadename = jadename.replace(g.VIEWDIR+'/','');
						jadename = jadename.replace(/\.jade$/,'');
						util.log('Precompile Jade : ['+jadename+']');
						g.CJ[jadename] = jade.compile(fs.readFileSync(filename,'utf8'),
							{
								filename:filename,
								pretty:false
							});
						cb(null,0);
					} else {
						cb(null,0);
					}
				});
			};
		}
		async.parallel(funcs,function(err,resultss){
			util.log('End of '+dir);
			callback();
		});
	});
}

// jade 렌더링, 개발시/템플릿로딩 전에는 위에꺼, 서비스시에는 아래꺼
var Render = function(res,jadepath,param){
	param.DateString = DateString;
	param.DateString2 = function(d){return d.toFormat( "YYYY-MM-DD HH24:MI:SS" )};
	if(!g.DEVELOPMENT && g.CJ[jadepath]) {
		param.pretty = true;
		res.send(g.CJ[jadepath](param));
	} else {
		//res.render(jade,param);

		util.log('Rendering : '+g.VIEWDIR+'/'+jadepath+'.jade');
		// sync function
		g.CJ[jadepath] = jade.compile(fs.readFileSync(g.VIEWDIR+'/'+jadepath+'.jade', 'utf8'),
			{
				filename:g.VIEWDIR+'/'+jadepath+'.jade',
				pretty:true
			}
		);
		res.send(g.CJ[jadepath](param));

		// do same with async function
		//fs.readFile(g.VIEWDIR+'/'+jadepath+'.jade', 'utf8', 
		//	function (err, data) {
		//		if(err) {
		//			util.log('ERROR : Jade File Not Found - '+g.VIEWDIR+'/'+jadepath+'.jade');
		//			res.redirect('/'+param.req.LANG);
		//		} else{
		//			util.log('Rendering : '+g.VIEWDIR+'/'+jadepath+'.jade');
		//			g.CJ[jadepath] = jade.compile(data,
		//				{
		//					filename:g.VIEWDIR+'/'+jadepath+'.jade',
		//					pretty:true
		//				}
		//			);
		//			res.send(g.CJ[jadepath](param));
		//		}
		//	}
		//);
	}
}

// UTC 표준시로 바꿔주기
var ToUTC = function(t){
	var t2 = t.clone();
	return t2.addHours(-Number(t2.getUTCOffset())/100);
}

var ClearSession = function(req,res){
	req.cookieJSON = SafeParse('{}');
	// 기본 세션 쿠키 삭제
	res.clearCookie(g.COOKIE_SESSION,{ path:'/', domain:g.COOKIE_DOMAIN, httpOnly: false  });
}

var MakeUpSession = function(req,res,cb){
	var cookieJSON = {
			userid : req.query.userid,
			time : date.toFormat( "YYYY-MM-DD HH24:MI:SS" )
	};
	res.clearCookie(g.COOKIE_SESSION,{ path:'/', domain:g.COOKIE_DOMAIN, httpOnly: false  });
	res.cookie(g.COOKIE_SESSION, EncryptAES(SafeToString(cookieJSON)), { path:'/', domain:g.COOKIE_DOMAIN, httpOnly: false  });
	cb(req,res);
}

// Login
var InternalLogin = function(req,res,cb){
	if(req.query.userid && req.query.userid.length>0) {
		cb(req,res,true);
	}
}

// auth check middleware
var AuthCheck = function(option){
	// option is optional
	return function(req,res,next){
		date.setTimeToNow();

		if(typeof req.headers['x-real-ip'] !== 'undefined')
			req.IP = req.headers['x-real-ip'];
		else
			req.IP = req.connection.remoteAddress;

		req.isMobile = /(iphone|ipad|ipod|android|symbian|symbianos|blackberry|samsung|nokia|windows ce|sonyericsson|webos|wap|motor)/i.test(req.headers['user-agent']);

		if(req.cookieJSON)
			delete req.cookieJSON;
		if(!req.cookies[g.COOKIE_SESSION])
		{
			req.cookies[g.COOKIE_SESSION] = "{}";
			req.cookieJSON = SafeParse("{}");
		} else {
			req.cookieJSON = SafeParse(DecryptAES(req.cookies[g.COOKIE_SESSION]));
		}

		if(req.cookieJSON.userid && req.cookieJSON.userid.length>0)
			req.AuthResult = "";
		else
			req.AuthResult = "인증값이 유효하지 않습니다";

		next();
	}
}


var EncryptAES = function(plain){
	var cipher = crypto.createCipheriv('aes256', cryptkey, iv);			// 고정키 암호화 도구
	var p = String(plain);
	while(p.length%32!==0)
		p+=' ';
	return cipher.update(p, 'utf8', 'hex')+cipher.final('hex');
}

var DecryptAES = function(enc){
	var decipher = crypto.createDecipheriv('aes256', cryptkey, iv);		// 고정키 복호화 도구
	var ret = decipher.update(enc, 'hex', 'utf8')+decipher.final('utf8');
	return ret.replace(/ +$/g,'');
}

var BcryptHash = function(str){
	var salt = bcrypt.genSaltSync(10);  
	return bcrypt.hashSync(str, salt);
}

var BcryptCompare = function(str,hash){
	return bcrypt.compareSync(str, hash);
}

var URLDecode = function(encoded) {
	var HEXCHARS = "0123456789ABCDEFabcdef";
	//var plaintext = "";
	var plaintext = new Buffer(1024);
	var i = 0, j = 0;

	while (i < encoded.length)
	{
		var ch = encoded.charAt(i);
		if (ch == "+")
		{
			plaintext[j]=0x20;
			j++;
			i++;
		} else if (ch == "%")
		{
			if (i < (encoded.length-2)
				&& HEXCHARS.indexOf(encoded.charAt(i+1)) != -1
				&& HEXCHARS.indexOf(encoded.charAt(i+2)) != -1 )
			{
				plaintext[j] = parseInt("0x"+encoded.substr(i+1,2));
				j++;
				i += 3;
			} else {
				i++;
			}
		} else {
			plaintext[j++] = encoded.charCodeAt(i);
			i++;
		}
	}

	var convtext = plaintext.slice(0,j);
	
	var iconv = new Iconv('euc-kr','utf-8');
	var buffer = iconv.convert(convtext);
	return buffer;	
};

var MoveFile = function(from,to,cb){
	exec('mv '+from+' '+to,function(err, stdout, stderr){
		util.log('MoveFile ['+stdout+']['+stderr+']');
		cb();
	});
}

var getFileExtension = function(filename) {
  if (filename.length == 0)
    return "";
  var dot = filename.lastIndexOf(".");
  if (dot == -1)
    return "";
  var extension = filename.substr(dot, filename.length);
  return extension;
}

var SafeParse = function(str){
	try{
		var r = JSON.parse(str);
		return r;
	} catch(e){
		return {};
	};
}

var SafeToString = function(obj){
	try{
		var r = JSON.stringify(obj);
		return r;
	} catch(e){
		return '';
	};
}

var DateString = function(d){
	var date = new Date(d);
	//date.setISO8601(d);
	var tmpdate = new Date(date.valueOf());
	var timestring;
	var now = new Date();
	tmpdate.setDate(date.getDate()+1);
	if(now < tmpdate)
	{
		tmpdate = new Date(date.valueOf());
		tmpdate.setHours(date.getHours()+1);
		var a = new Date(now-date);
		if( now < tmpdate)
		{
			timestring = (now>date ? a.getUTCMinutes():0)+"분 전";
		} else {
			timestring = a.getUTCHours() + "시간 전";
		}
	} else {
		timestring = String(date.getFullYear())+"년 "+String(date.getMonth()+1)+"월 "+date.getDate()+"일";
	}
	return timestring;
}

module.exports = {
	string_repeat : string_repeat,
	string_format : string_format,
	GR: GR,
	JadePrecompile : JadePrecompile,
	Render : Render,
	date : date,
	ToUTC : ToUTC,
	ClearSession : ClearSession,
	MakeUpSession : MakeUpSession,
	InternalLogin : InternalLogin,
	AuthCheck : AuthCheck,
	EncryptAES : EncryptAES,
	DecryptAES : DecryptAES,
	BcryptHash : BcryptHash,
	BcryptCompare : BcryptCompare,
	URLDecode: URLDecode,
	MoveFile : MoveFile,
	getFileExtension : getFileExtension,
	SafeParse : SafeParse,
	SafeToString : SafeToString,
	DateString : DateString
};
