function paramize(a) { return encodeURI(JSON.stringify(a)); } 
function datafy(a) { return JSON.parse(decodeURI(a)); } 
function Refresh() { window.location.reload(true); }
function Moveto(url) { window.location.href = url; }
function DateString(d){
	var date = new Date();
	date.setISO8601(d);
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
		timestring = String(date.getMonth()+1)+"월 "+date.getDate()+"일";
	}
	return timestring;
}
function SafeParse(o){
	if(o===null || typeof o === 'undefined' || o.length==0)
		return {};
	else {
		return JSON.parse(o);
	}
};
// jquery.formparams.js가 더 나을수도 있음
jQuery.fn.serializeObject = function() {
	var arrayData, objectData;
	arrayData = this.serializeArray();
	objectData = {};

	$.each(arrayData, function() {
		var value;

		if (this.value != null) {
			value = this.value;
		} else {
			value = '';
		}

		var non_array_name = this.name.replace(/\[\]$/,'');
		if (/\[\]$/.test(this.name)/* && objectData[this.name] != null*/) {
			if (!Array.isArray(objectData[non_array_name])) {
				objectData[non_array_name] = [];
			}
			objectData[non_array_name].push(value);
			alert(non_array_name);
		} else {
			objectData[this.name] = value;
		}
	});

	return objectData;
};




function email_tmpl(tmpl, type){
	var default_tmpl = {
		'TITLE':
			'서베이인사이드의 조사에 참여해 주시기 바랍니다',
		'AUTH':
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n'+
			'<html xmlns="http://www.w3.org/1999/xhtml">\n'+
			'<head>\n'+
			'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'+
			'<title>Untitled Document</title>\n'+
			'</head>\n'+
			'\n'+
			'<body>\n'+
			'<table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'  <tr>\n'+
			'    <td><img src="http://centerfortalent.net/images/kj_mail.png" width="300" height="50" /></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'      <tr>\n'+
			'        <td width="150" bgcolor="#660000">&nbsp;</td>\n'+
			'        <td bgcolor="#990000">&nbsp;</td>\n'+
			'      </tr>\n'+
			'    </table></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><p>&nbsp;</p>\n'+
			'    <p>&nbsp;</p>\n'+
			'    <p>다음의 링크를 클릭해서 설문 <[TITLE]>에 참여해 주시기 바랍니다</p>\n'+
			'    <p>[LINK]</p>\n'+
			'    <p>아이디 : [ID]</p>\n'+
			'    <p>패스워드 : [PW]</p>\n'+
			'    <p>&nbsp;</p>\n'+
			'    <p>&nbsp;</p></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'      <tr>\n'+
			'        <td bgcolor="#660000">&nbsp;</td>\n'+
			'        <td width="150" bgcolor="#990000">&nbsp;</td>\n'+
			'      </tr>\n'+
			'    </table></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><img src="http://centerfortalent.net/images/kj_mail2.png" width="450" height="30" /></td>\n'+
			'  </tr>\n'+
			'</table>\n'+
			'</body>\n'+
			'</html>',

		'LINK':
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n'+
			'<html xmlns="http://www.w3.org/1999/xhtml">\n'+
			'<head>\n'+
			'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'+
			'<title>Untitled Document</title>\n'+
			'</head>\n'+
			'\n'+
			'<body>\n'+
			'<table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'  <tr>\n'+
			'    <td><img src="http://centerfortalent.net/images/kj_mail.png" width="300" height="50" /></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'      <tr>\n'+
			'        <td width="150" bgcolor="#660000">&nbsp;</td>\n'+
			'        <td bgcolor="#990000">&nbsp;</td>\n'+
			'      </tr>\n'+
			'    </table></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><p>&nbsp;</p>\n'+
			'    <p>&nbsp;</p>\n'+
			'    <p>다음의 링크를 클릭해서 설문 <[TITLE]>에 참여해 주시기 바랍니다</p>\n'+
			'    <p>[LINK]</p>\n'+
			'    <p>&nbsp;</p>\n'+
			'    <p>&nbsp;</p></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'      <tr>\n'+
			'        <td bgcolor="#660000">&nbsp;</td>\n'+
			'        <td width="150" bgcolor="#990000">&nbsp;</td>\n'+
			'      </tr>\n'+
			'    </table></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><img src="http://centerfortalent.net/images/kj_mail2.png" width="450" height="30" /></td>\n'+
			'  </tr>\n'+
			'</table>\n'+
			'</body>\n'+
			'</html>',
		'FREE':
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n'+
			'<html xmlns="http://www.w3.org/1999/xhtml">\n'+
			'<head>\n'+
			'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'+
			'<title>Untitled Document</title>\n'+
			'</head>\n'+
			'\n'+
			'<body>\n'+
			'<table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'  <tr>\n'+
			'    <td><img src="http://centerfortalent.net/images/kj_mail.png" width="300" height="50" /></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'      <tr>\n'+
			'        <td width="150" bgcolor="#660000">&nbsp;</td>\n'+
			'        <td bgcolor="#990000">&nbsp;</td>\n'+
			'      </tr>\n'+
			'    </table></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><p>&nbsp;</p>\n'+
			'    <p>&nbsp;</p>\n'+
			'    <p>다음의 링크를 클릭해서 설문 <[TITLE]>에 참여해 주시기 바랍니다</p>\n'+
			'    <p>[LINK]</p>\n'+
			'    <p>&nbsp;</p>\n'+
			'    <p>&nbsp;</p></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><table width="500" border="0" cellspacing="0" cellpadding="0">\n'+
			'      <tr>\n'+
			'        <td bgcolor="#660000">&nbsp;</td>\n'+
			'        <td width="150" bgcolor="#990000">&nbsp;</td>\n'+
			'      </tr>\n'+
			'    </table></td>\n'+
			'  </tr>\n'+
			'  <tr>\n'+
			'    <td><img src="http://centerfortalent.net/images/kj_mail2.png" width="450" height="30" /></td>\n'+
			'  </tr>\n'+
			'</table>\n'+
			'</body>\n'+
			'</html>'
	};
	if(tmpl && tmpl[type])
		return tmpl[type];
	else
		return default_tmpl[type];
}