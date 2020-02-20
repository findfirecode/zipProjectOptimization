// 此处代码是为了解决ios12上的js的reverse bug而设置的。一般不进行修改。 详情见：https://segmentfault.com/a/1190000016448062
(function() {
    var ua = navigator.userAgent;
    if (!ua.match(/(iPhone|iPad|iPod|Macintosh)/)) return;
    Array.prototype._reverse = Array.prototype.reverse;
    Array.prototype.reverse = function reverse() {
        this.length = this.length;
        return Array.prototype._reverse.call(this);
    }
    var nonenum = {
        enumerable: false
    };
    Object.defineProperties(Array.prototype, {
        _reverse: nonenum,
        reverse: nonenum,
    });
})();