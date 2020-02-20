/**
 *
 * Spice
 * 
 * 详细用法请参考：http://10.8.21.101
 * @ author Razy
 * @ version 3.0.0
 *
 */

!function(a){"use strict";function b(b,c){if(!b||a.isPlainObject(b))return!1;var d=[];return a(b).each(function(b,f){var g=a(f),h=g.data("spice.calculateNum");h||g.data("spice.calculateNum",h=new e(g,c)),d.push(h)}),d}var c={btnMinus:".btn-minus",btnPlus:".btn-plus",textInput:".form-input",max:10,min:0,callBack:null},d={initMaxNum:function(a){var b=a.elem.attr("data-stock"),c=a.opt.max;a.opt._max=b&&c>=b?b:c}},e=function(b,d){var e=this;e.opt=a.extend({},c,d),e.elem=b,e.init()};e.prototype={init:function(){var b=this,c=b.opt,e=b.elem,f=c.plus=a(c.btnPlus,e),g=c.minus=a(c.btnMinus,e),h=c.textInput=a(c.textInput,e);b.initEvent(),f.bind(a.spice.click,function(){d.initMaxNum(b),b.plus()}),g.bind(a.spice.click,function(){d.initMaxNum(b),b.minus()}),h.bind("keyup /*keypress*/",function(){d.initMaxNum(b);var e=Number(h.val());e=e&&e<=c._max&&e>=c.min?e:c.min,h.val(e),c.callBack&&a.isFunction(c.callBack)&&c.callBack(b,e)}).bind("blur",function(){d.initMaxNum(b),h.val()||(h.val(c.min),c.callBack&&a.isFunction(c.callBack)&&c.callBack(b,c.min))})},plus:function(){var b=this.opt.textInput,c=+b.val(),d=this.opt._max;c+=1,c=d>=c?c:d,b.val(c),this.opt.callBack&&a.isFunction(this.opt.callBack)&&this.opt.callBack(this,c)},minus:function(){var b=this.opt.textInput,c=+b.val();c-=1,c=c>=this.opt.min?c:this.opt.min,b.val(c),this.opt.callBack&&a.isFunction(this.opt.callBack)&&this.opt.callBack(this,c)},initEvent:function(){this.opt.plus.add(this.opt.minus).unbind(a.spice.click),this.opt.textInput.unbind("keyup keypress blur")}},a.spice.calculateNum=b}(jQuery);