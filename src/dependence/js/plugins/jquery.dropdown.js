/**
 *
 * Spice
 * 
 * 详细用法请参考：http://10.8.21.101
 * @ author Razy
 * @ version 3.0.0
 *
 */

!function(a){"use strict";function b(b,c){if(!b||a.isPlainObject(b))return!1;a("body").bind("tap",function(b){a.each(d,function(c,d){var e=a(d).data("spice.dropdown");a.contains(a(d)[0],b.target)||(a(e.opt.showElem,d).hide(),e.elem.removeClass(e.opt.addClass),e.elem.trigger("menuHide",{self:e}))})});var f=[];return a(b).each(function(b,g){var h=a(g),i=h.data("spice.dropdown");d.push(g),i||h.data("spice.dropdown",i=new e(h,c)),f.push(i)}),f}var c={dropElem:".btn",showElem:".sub-menu",addClass:"is-open"},d=[],e=function(b,d){var e=this;e.opt=a.extend({},c,d),e.elem=b,e.init()};e.prototype={init:function(){var b=this,c=b.opt,d=b.elem,e=a(c.dropElem,d),f=a(c.showElem,d);e.bind("tap",function(){b.hideMenu(d),f.is(":visible")?(f.hide(),d.removeClass(c.addClass),d.trigger("menuHide",{self:b})):(f.show(),d.addClass(c.addClass),d.trigger("menuShow",{self:b}))}),f.bind("tap",function(){e.trigger("tap")})},hideMenu:function(b){var c=this;a.each(d,function(d,e){a(c.opt.showElem,a(e).not(b)).hide()})}},a.spice.dropdown=b}(jQuery);