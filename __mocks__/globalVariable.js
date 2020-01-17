const variable = {
  couponDataMap: [{
    aa: 11,
    bb: 22
  }],
  isBlank: function (str) {
    var strLen;
    if (str == null || (strLen = str.length()) == 0) {
      return true;
    }
    for (var i = 0; i < strLen; i++) {
      if ((Character.isWhitespace(str.charAt(i)) == false)) {
        return false;
      }
    }
    return true;
  },
  base: "https://stage.samsungeshop.com.cn/"
}

export default variable
