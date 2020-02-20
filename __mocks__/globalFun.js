const mockFun = {
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

export default mockFun
