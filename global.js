var g = {
	DEVELOPMENT : false,
	CJ : {},								// Compiled Template, Jade폴더에서 가져옴
	UPLOADPROGRESS : {},					// form/multipart의 취득 진척도(세션별)
	HOMEURI : 'nodeconf.beejei.com',		// Redirect시의 uri
	COOKIE_SESSION : 'nodeconf_beejei',
	COOKIE_DOMAIN : 'nodeconf.beejei.com',	// Cookie 셋팅시의 uri(root)
	TIMEOUT : 24*60*60*1000,				// Session timeout : 1일
	VIEWDIR : ''							// Template Directory
};

module.exports = g;
