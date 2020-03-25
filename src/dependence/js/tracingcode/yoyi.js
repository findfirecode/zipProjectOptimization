 // 旧yoyi代码  --> 被新的老YOYI全站代码 替换
var _ymp = _ymp || [];
 (function() {

      var yda   = document.createElement('script');

    yda.type  = 'text/javascript';

    yda.async = true;

    yda.src = ('https:' == document.location.protocol ? 'https://databank.yoyi.com.cn' : 'http://databank.yoyi.com.cn')

            + '/cm.js?MzI2MTEzMDaMNwBCw3hDM%2BMkU3NTyzQLYwA%3D';

    var s = document.getElementsByTagName('script')[0];

    s.parentNode.insertBefore(yda, s);

 })();

// 新的老YOYI全站代码   暂时注释
//   var _ymp = _ymp || [];
//   (function() {
//      var yda   = document.createElement('script');
//     yda.type  = 'text/javascript';
//      yda.async = true;
//      yda.src = ('https:' == document.location.protocol ? 'https://databank.yoyi.com.cn' : 'http://databank.yoyi.com.cn')
//              + '/cm.js?MzI2MTEzN7WINwBCw3hDMzPDRKNEA8MkYwA%3D';
//      var s = document.getElementsByTagName('script')[0];
//      s.parentNode.insertBefore(yda, s);
//   })();
 
 // 新yoyi代码
(function() {
	    window['yoyi'] = window['yoyi'] || function(a) {
	        return function() {
	            (window['yoyi']._req = window['yoyi']._req || []).push([a, arguments]);
	        }
	    };
	    var funs = ['init', '_init', 'set_config', 'get_config', '_loaded', 'setUser', '_send_request', 'track_event', 'track', 'track_pageview', 'close_page', 'track_link'];
	    for (var i = 0; i < funs.length; i++) {
	        window['yoyi'][funs[i]] = window['yoyi'].call(null, funs[i]);
	    }
	    var yda   = document.createElement('script');
	    yda.type  = 'text/javascript';
	    yda.async = true;
	    yda.src =('https:' == document.location.protocol ? 'https://' : 'http://') + 'sdk.yoyi.com.cn/yt.min.js';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(yda, s);
	    yoyi.init('167340d61d523037', {
	        auto_track: true,  
	        cookie_mapping: true,
	        single_page: false,
	    });
	})();