/**
 *
 * Spice
 * 
 * 详细用法请参考：http://10.8.21.101
 * @ author Razy
 * @ version 3.0.0
 *
 */

!function(a){a.spice.placeholder=function(b,c){return!b||a.isPlainObject(b)?!1:a(b).each(function(){var b=a(this),d=a.extend({text:b.attr("placeholder"),cssClass:"placeholder"},"string"===a.type(c)?{text:c}:c||{});if(b.attr("placeholder",d.text),!("placeholder"in document.createElement("input"))){var e=function(){""===a.trim(b.val())&&b.addClass(d.cssClass).val(d.text)},f=function(){b.val()===d.text&&b.val(""),b.removeClass(d.cssClass)};e(),b.unbind(".placeholder").bind({"focus.placeholder":f,"blur.placeholder":e})}})}}(jQuery);