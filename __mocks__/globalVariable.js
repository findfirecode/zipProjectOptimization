const mockFun = {
  isBlank: function isBlank(str) {
    return str == null || $.trim(str).length == 0;
  }
}

export default mockFun
