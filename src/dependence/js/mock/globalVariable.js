// 模拟应用所需要的的变量
const applicationVariable = {
	'couponDataMap' : [
    {"activeMark":1,"couponId":494,"couponName":"会员周签到优惠10元券","couponType":1,"discount":10,"endTime":1640966400000,"id":51,"isused":0,"showAccount":true,"startTime":1577808000000,"useUrl":"https://stage.samsungeshop.com.cn","version":1564996858890},
    {"activeMark":1,"couponId":462,"couponName":"测试优惠券A0805","couponType":1,"discount":100,"endTime":1640966400000,"id":50,"isused":0,"itemCodes":"SM-G9650","showAccount":true,"startTime":1545235200000,"supportTourists":true,"useUrl":"https://stage.samsungeshop.com.cn","version":1564996858890},
    {"activeMark":1,"couponId":75,"couponName":"C7免单优惠券","couponType":1,"discount":10,"endTime":1640966400000,"id":47,"isused":0,"itemCodes":"null","showAccount":true,"startTime":1467165600000,"supportTourists":true,"useUrl":"/activity/InSelling20180129.htm?m01=fe51696e-6904-4150-abb0-28255cb4803b","version":1564991833863}
  ],
}
// 模拟应用所需要的的fun
const applicationFun = {
  isBlank: function isBlank(str) {
    return str == null || $.trim(str).length == 0;
  },
  getCookie: function (name) {//获取cookie
    //cookie中的数据都是以分号加空格区分开
    var arr = document.cookie.split("; ");
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].split("=")[0] == name) {
        return arr[i].split("=")[1];
      }
    }
    //未找到对应的cookie则返回空字符串
    return '';
  },
  removeCookie: function (name) {//删除cookie
    //调用setCookie方法，把时间设置为-1
    setCookie(name, 1, -1);
  }
}

Object.assign(applicationVariable, applicationFun)
module.exports = applicationVariable