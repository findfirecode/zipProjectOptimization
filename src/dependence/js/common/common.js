(function() {
    if (!window.console) {// 创建空console对象，避免JS报错
        window.console = {};
    }
    var console = window.console;
    var funcs = [ 'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd',
            'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn' ];
    for (var i = 0, l = funcs.length; i < l; i++) {
        var func = funcs[i];
//        if ("pro"==profile||!console[func]) {//生产环境不要输出日志
//            console[func] = function() {
//            };
//        }
    }
    if (!console.memory) {
        console.memory = {};
    }
})();

var telphonereg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;

var key_search_default = '输入关键词';
var zip_code_pattern = /^[0-9][0-9]{5}$/;
var mobile_phone_pattern = /^(1[3-9]{1}[0-9]{1})\d{8}$/;
var phone_pattern = new RegExp("");
var empty_pattern = new RegExp("/^\s+|\s+$/g");
var illegal_char_pattern = new RegExp("^[^\<\>]+$");
var emailreg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

//加为书签
$(document).ready(function() {
	 if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){  
		 $("#sc").html('<a href="'+location.href+'"  title="'+document.title+'" rel="sidebar">加为书签</a>');
	   }else{
		   $("#sc").html('<a href="javascript:bookmarksite()"  rel="sidebar">加为书签</a>');
	   }  
});


// 转义特殊字符
function char_cv(str) {
    if (str != '') {
        str = str.replace(/</g, '&lt;');
        str = str.replace(/%3C/g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/%3E/g, '&gt;');
        str = str.replace(/'/g, '&#39;');
        str = str.replace(/"/g, '&quot;');
    }
    return str;
}

/**
 * 判断字符是不是空
 * 
 * @param str
 */
function isNotNullOrEmpty(str) {
    if (str != undefined && str != null && str != "" && str != "undefined") {
        return true;
    } else {
        return false;
   
    }
}
/**
 * 转为num判断的
 * @param str
 * @returns
 */
function isNotNullOrEmptyNum(str){
	if (str != undefined && str != null && str != "" && str != "undefined" && str != "null") {
	        return str;
	} else {
	        return 0;
	   
	}
}

function isBlank(val) {
    if (val == null) {
        return true;
    } else if (val == "") {
        return true;
    } else if (val == "undefined") {
        return true;
    } else {
        return false;
    }
}

function isNotBlank(val) {
    return !isBlank(val);
}

// 检查是否相等
function isEquals(a, b) {
    if (a == b) {
        return true;
    } else {
        return false;
    }
}

/**
 * 检查字符串格式，主要验证是否存在不合法字符
 * 
 * @param val
 * @returns
 */
function isFormatString(val) {
    return illegal_char_pattern.test(val);
}

function isNotFormatString(val) {
    return !isFormatString(val);
}

/**
 * 检查手机号码格式
 * 
 * @param val
 * @returns
 */
function isFormatMobile(val) {
    return mobile_phone_pattern.test(val);
}

function isNotFormatMobile(val) {
    return !isFormatMobile(val);
}

/**
 * 检查邮编格式
 * 
 * @param val
 * @returns
 */
function isFormatZipcode(val) {
    return zip_code_pattern.test(val);
}

function isNotFormatZipcode(val) {
    return !isFormatZipcode(val);
}

/**
 * 检查邮箱格式
 * 
 * @param val
 * @returns
 */
function isFormatEmail(val) {
    return emailreg.test(val);
}

function isNotFormatEmail(val) {
    return !isFormatEmail(val);
}

/**
 * 检查电话号码格式
 * 
 * @param val
 * @returns
 */
function isFormatTelephone(val) {
    return telphonereg.test(val);
}
function isNotFormatTelephone(val) {
    return !isFormatTelephone(val);
}

/**
 * 清楚内容与获得焦点
 * 
 * @param obj
 */
function clearValueAndFocus(obj) {
    $(obj).val("");
    $(obj).focus();
}

function checkFieldConsignee(val) {
    if (isBlank(val)) {
        return "收货人姓名不能为空，请填写";
    } else {
        if ($.trim(val) == "请填写正确姓名") {
            return "收货人姓名不能为空，请填写";
        }
        if (isNotFormatString(val)) {
            return "收货人姓名中包含非法字符";
        }
    }
    return "";
}

function checkFieldAddress(val) {
    if (isBlank(val)) {
        return "详细地址不能为空，请填写";
    } else {
        if ($.trim(val) == "请填写详细路名及门牌号") {
            return "详细地址不能为空，请填写";
        }
        if (isNotFormatString(val)) {
            return "详细地址中包含非法字符";
        }
    }
    return "";
}

function checkFieldZipcode(val) {
    if (isBlank(val)) {
        return "邮政编码不能为空，请填写";
    } else {
        if ($.trim(val) == "请填写正确的邮政编码") {
            return "邮政编码不能为空，请填写";
        }
        if (isNotFormatZipcode(val)) {
            return "邮政编码格式不正确";
        }
    }
    return "";
}

function checkFieldMobile(val) {
    if (isBlank(val)) {
        return "手机号码不能为空，请填写";
    } else {
        if ($.trim(val) == "请填写正确的手机号码") {
            return "手机号码不能为空，请填写";
        }
        if (isNotFormatMobile(val)) {
            return "手机号码格式不正确";
        }
    }
    return "";
}

function checkFieldEmail(val) {
    if (isBlank(val)) {
        return "邮箱不能为空，请填写";
    } else {
        if ($.trim(val) == "请填写正确的邮箱") {
            return "邮箱不能为空，请填写";
        }
        if (isNotFormatEmail(val)) {
            return "邮箱格式不正确";
        }
    }
    return "";
}


// 空字符
function isNull(val) {
    if (val == null || $.trim(val) == '') {
        return true;
    }
    return false;
}

// 中国大陆固定电话号码
function isTelPhone(telPhone) {
    var telPhonePattern = /^(\d{4}-|\d{3}-)?(\d{8}|\d{7})$/;
    return telPhonePattern.test(telPhone);
}

// 中国大陆手机号码
function isMobile(mobile) {
    var mobilePattern = /^(1[3-9]{1}[0-9]{1})\d{8}$/;
    return mobilePattern.test(mobile);
}

// 中国大陆邮政编码
function isZipcode(zipcode) {
    var zipcodePattern = /^[1-9]\d{5}$/;
    return zipcodePattern.test(zipcode);
}

// 电子邮箱
function isEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email.replace(/(^\s*)|(\s*$)/g, ''));
}

// 中英文姓名
function isFamliyName(name) {
    var famliyNamePattern = /^([\u4E00-\u9FA5]{1,10}|[a-zA-Z]{2,14})$/;
    return famliyNamePattern.test(name);
}

// 生日验证yyyy-MM-dd
function isBirthDay(birthDay) {
    var birthDayPattern = /^(\d{4})(-)(\d{1,2})(-)(\d{1,2})$/;
    return birthDayPattern.test(birthDay);
}

// 普通版用户密码
function isPassword(password) {
    var passwordPattern = /^[a-zA-Z0-9_-]{6,18}$/;
    return passwordPattern.test(password);
}

// 验证码(4位数字)
function isSecurityCode(code) {
    var securityCodePattern = /^[a-zA-Z0-9]{4}$/;
    return securityCodePattern.test(code);
}

function isPassword6(password){
	var passwordPattern = /.{6}/;
	return passwordPattern.test(password);
}

function isPasswordNum6(password){
	var passwordPattern = /^\d{6}$/;
	return passwordPattern.test(password);
}

function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function fMoney(s, n)   
{   
   n = n >= 0 && n <= 20 ? n : 2;   
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
   var l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1];   
   t = "";   
   for(i = 0; i < l.length; i ++ )   
   {   
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
   }
   if(n == 0){
	   return t.split("").reverse().join("");
   }else{
	   return t.split("").reverse().join("") + "." + r;   
   }
   
}

function fPoint(s, n)
{
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for(i = 0; i < l.length; i ++ )
    {
        t += l[i];
    }
    var y = Math.floor(t.split("").reverse().join("") + "." + r)+"";
    var ll = y.split("").reverse();
    var c = "";
    for (var x=0; x<ll.length; x++){
        c += ll[x] + ((x + 1) % 3 == 0 && (x + 1) != ll.length ? "," : "");
    }
    return c.split("").reverse().join("");
}

//两数相减，解决精度问题
function accSub(num1,num2){
    var r1,r2,m;
    try{
        r1 = num1.toString().split('.')[1].length;
    }catch(e){
        r1 = 0;
    }
    try{
        r2=num2.toString().split(".")[1].length;
    }catch(e){
        r2=0;
    }
    m=Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return (Math.round(num1*m-num2*m)/m).toFixed(n);
 }