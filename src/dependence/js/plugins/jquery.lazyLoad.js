/**
 *
 * Spice
 *
 * 详细用法请参考：http://10.8.21.101
 * @ author Razy
 * @ version 3.0.0
 *
 */

! function(a) {
	a.spice.lazyLoad = function(b, c) {
		if (!b || a.isPlainObject(b)) return !1;
		var d = a.extend({
				attr: "lazy-src",
				timeout: 200,
				parents: null,
				prestrain: 0,
				callBack: null
			}, c || {}),
			e = a(b),
			f = a(window);
		f.unbind("scroll.lazyLoad").bind("scroll.lazyLoad", function() {
			var b = f.height(),
				c = f.scrollTop() + b;
			e.each(function(b, e) {
				var f = a(e);
				a('<img src="' + f.attr("src") + '" />').bind("load", function() {
					var b = d.parents ? f.parents(d.parents) : f,
						e = b.offset().top,
						g = b.height();
					if (c > e - g * d.prestrain) {
						var h = f.attr(d.attr);
						if (!h) return;
						a("<img src='" + h + "' />").bind("load", function() {
							f.css({
								opacity: 0
							}).attr("src", h).removeAttr(d.attr).animate({
								opacity: 1
							}, d.timeout), d.callBack && a.isFunction(d.callBack) && d.callBack(f)
						})
					}
				})
			})
		}).resize(function() {
			f.trigger("scroll.lazyLoad")
		}).trigger("scroll.lazyLoad")
	}
}(jQuery);
