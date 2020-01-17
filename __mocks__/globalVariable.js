const variable = {
  couponDataMap: [{
    aa: 11,
    bb: 22
  }],
  isBlank: function isBlank(str) {
    return str == null || $.trim(str).length == 0;
  },
  base: "https://stage.samsungeshop.com.cn/"
}

export default variable
