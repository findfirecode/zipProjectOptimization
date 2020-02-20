/**
 *
 * 轮播效果
 * 详细用法请参考：http://v3.spice.lh/javascript/kvscroll
 * 如果链接无法访问，请联系QQ：1515110755 或 RTX：hong.liang
 *
 * @ author Razy
 * @ version 1.0
 *
 */

(function($){

	"use strict";

	var isAndroid = $.spice.android
		, hasTouch = $.spice.hasTouch
		, START_EV = hasTouch ? 'touchstart.kvScroll' : 'mousedown.kvScroll'
		, MOVE_EV = hasTouch ? 'touchmove.kvScroll' : 'mousemove.kvScroll'
		, END_EV = hasTouch ? 'touchend.kvScroll touchcancel.kvScroll' : 'mouseleave.kvScroll'
		, UP_EV = hasTouch ? 'touchend.kvScroll' : 'mouseup.kvScroll';

	//存储默认参数
	var defaultOptions = {
			type 		: 'scroll'			//效果的类型
			, axis		: 'x'				//方向
            , easing	: 'normal'			//动画时间控制，'slow' or 'normal' or 'fast' or number
            , autoPlay	: true				//是否自动轮播
			, time		: 3000				//自动轮播时间
            , loop		: true				//是否无限循环滚动
            , moveNum	: 1 				//滚动个数
            , stopElem	: null				//该选择器元素如果显示则取消touch滚动
            , callBack	: null				//回调函数
            //, animate 	: '.animate-box'	//有动画效果的元素选择器
            , dot 		: {
            	style: null 				//'dot', 'text', 'custom'
            	, dotsEvent: 'tap'
            }
            , btn 		: true
	    };

	var defaultFunc = {
		fade: function($this, page){
			var opt = $this.opt
	    		, $ul = $this.ul
	    		, $li = $this.li;

	    	$li.not(':eq('+page+')').hide();
	    	$this.curPage = page;
   			$this.initDotsAClass($this.curPage);
   			defaultFunc.disabledBtn( $this );
			$li.eq(page).fadeIn(opt.easing, function(){
   				!$this.isHover && $this.addInterval();
				opt.callBack && $.isFunction(opt.callBack) && opt.callBack($this.curPage, $this);
			});
		}
		, scroll: function($this, page){
			var opt = $this.opt
	    		, $ul = $this.ul
	    		, $li = $this.li
	    		, obj = {}
	    		, H = $this.getLiH();

	    	if(opt.axis == 'y'){
	    		obj['marginTop'] = '-' + page*H + 'px';
	    	}else{
	    		obj['marginLeft'] = '-' + page*parseInt($ul.parent().width()) + 'px';
	    	}

	    	$this.curPage = page;
    		if(opt.type == 'scroll-loop' && opt.loop){
   				if(page == 0){
   					$this.curPage = $this.liLength - 2;
   				}else if(page == $this.maxPage){
   					$this.curPage = 1;
   				}else{
   					$this.curPage = page;
   				}
   			}
   			$this.initDotsAClass($this.curPage - (opt.type == 'scroll-loop' && opt.loop ? 1 : 0));
   			defaultFunc.disabledBtn( $this );

			$ul.animate(obj, opt.easing, function(){
	    		if(opt.type == 'scroll-loop' && opt.loop){
       				if(page == 0){
       					if(opt.axis == 'y'){
				    		obj['marginTop'] = '-' + ( $this.liLength - 2 )*H + 'px';
				    	}else{
				    		obj['marginLeft'] = '-' + ( $this.liLength - 2 )*parseInt($ul.parent().width()) + 'px';
				    	}
       					$ul.css(obj);
       				}else if(page == $this.maxPage){
       					if(opt.axis == 'y'){
       						obj['marginTop'] = '-' + H + 'px';
       					}else{
       						obj['marginLeft'] = '-' + parseInt($ul.parent().width()) + 'px';
       					}
       					$ul.css(obj);
       				}
       			}
       			!$this.isHover && $this.addInterval();
       			opt.callBack && $.isFunction(opt.callBack) && opt.callBack(page, $this);
       		});
		}
		, 'scroll-loop': function($this, page){
			defaultFunc.scroll($this, page);
		}
		, gallery: function($this, page){
			var opt = $this.opt
	    		, $ul = $this.ul
	    		, $li = $this.li
	    		, obj = {};
	    	var ulMG = -page*(opt.axis == 'y' ? $this.getLiH() : $this.getLiW())*$this.moveNum;
    			ulMG = ulMG < $this.galleryMaxMG ? $this.galleryMaxMG : ulMG;
    			obj[(opt.axis == 'y' ? 'marginTop' : 'marginLeft')] = ulMG;

    		defaultFunc.disabledBtn( $this );

			$ul.animate(obj, opt.easing, function(){
				$this.curPage = page;
				!$this.isHover && $this.addInterval();
				opt.callBack && $.isFunction(opt.callBack) && opt.callBack(page, $this);
			});
		}
		, 'gallery-loop': function($this, page, c){
			if(hasTouch){
				defaultFunc.gallery($this, page);
				return false;
			}
			var opt = $this.opt
	    		, $ul = $this.ul
	    		, $li = $this.li
	    		, liW = $this.getLiW()
	    		, moveNum = -liW*$this.moveNum
	    		, ml = $this.getUlMl() + (c == 'prev' ? -moveNum : moveNum)
	    		, obj = {
	    			marginLeft: ml
	    		};

	    	if(c == 'prev'){
	    		if($this.getUlMl() > -$this.getLiW()*$this.moveNum){
					$ul.css({marginLeft: ($this.getUlMl()/liW - $li.length/3)*liW });
	    			obj.marginLeft = $this.getUlMl() - moveNum;
	    		}
			}else{
				if($this.getUlMl() < -$this.getLiW()*($li.length/3-1)){
					$ul.css({marginLeft: ($this.getUlMl()/liW + $li.length/3)*liW });
					obj.marginLeft = $this.getUlMl() + moveNum;
				}
			}
			defaultFunc.disabledBtn( $this );
			$ul.animate(obj, opt.easing, function(){});
		}
		/*, animateBefore: function(){

		}
		, animateAfter: function(){
			
		}*/
		/*
 		 * 手指滑动部分
		 */
		, sx: 0
		, sy: 0
		, mx: 0
		, my: 0
		, sMl: 0
		, sMt: 0
		, sMoveTime: 0
		, eMoveTime: 0
		, scrollHover: function($this){
			var opt = $this.opt;
	    	var $scrollHover = $this.elem;
	    	if(hasTouch){
				$scrollHover = $scrollHover.find('ul:eq(0)');
			}else{
				$scrollHover
					.off('mouseenter.pcKvScroll')
					.off('mouseleave.pcKvScroll')
					.on('mouseenter.pcKvScroll', function(){
						$this.removeInterval();
						$('body').addClass('noSelect');
					})
					.on('mouseleave.pcKvScroll', function(){
						$this.addInterval();
						$('body').removeClass('noSelect');
					});
			}

			$scrollHover
       			.off('.kvScroll')
       			.on(START_EV, function(e){

       				$scrollHover.off(MOVE_EV).off(END_EV);
       				
       				if( !$this.isNotAnimate() ) {
       					return false;
       				}

       				if(opt.axis == 'y') e.preventDefault();
       				/*
       				//if(hasTouch){
	       				$this.ul.stop(true, true);
	       			//}
					*/
       				$this.removeInterval();
       				//判断鼠标是否放在滚动区域内，用于是否重新添加定时任务
       				$this.isHover = true;
       				//
       				var exy = $.spice.getEventXY(e);
       				defaultFunc.sMl = $this.getUlMl();
       				defaultFunc.sMt = $this.getUlMt();
       				defaultFunc.sx = exy.x;
       				defaultFunc.sy = exy.y;
       				defaultFunc.mx = 0;
       				defaultFunc.my = 0;

       				defaultFunc.sMoveTime = new Date().getTime();

       				//$('#test').html( defaultFunc.sMl + '  ' + $this.ul[0].style.marginLeft );
       				
       				$scrollHover.on(MOVE_EV, function(e){
	       				$this.removeInterval();
	       				$this.isHover = true;

	       				//
	       				if(hasTouch && $this.isStopElem()){
	       					var exy = $.spice.getEventXY(e);
	       					defaultFunc.mx = exy.x;
	       					defaultFunc.my = exy.y;

	       					if(Math.abs(defaultFunc.mx - defaultFunc.sx) > 8 && opt.axis != 'y') e.preventDefault();

	       					if(opt.type != 'fade'){
	       						if(opt.axis == 'y'){
	       							var l = defaultFunc.my - (defaultFunc.sy - defaultFunc.sMt);
	       						}else{
	       							var l = defaultFunc.mx - (defaultFunc.sx - defaultFunc.sMl);
	       						}
	       						var obj = {};
	       						obj[(opt.axis == 'y' ? 'marginTop' : 'marginLeft')] = l;
	       						if(opt.type == 'scroll' 
		       						|| (opt.type == 'scroll-loop' && !opt.loop)){
	       							if(l > 0){
		       							obj[(opt.axis == 'y' ? 'marginTop' : 'marginLeft')] = Math.abs(l)/3;
			       						$this.ul.css(obj);
			       					}else if(l < -$this.maxPage*$this.li.width() && opt.axis != 'y'){
			       						$this.ul.css({marginLeft: (defaultFunc.mx - (defaultFunc.sx - defaultFunc.sMl) - defaultFunc.sMl)/3 + defaultFunc.sMl});
			       					}else if(l < -$this.maxPage*$this.li.height() && opt.axis == 'y'){
			       						$this.ul.css({marginTop: (defaultFunc.my - (defaultFunc.sy - defaultFunc.sMt) - defaultFunc.sMt)/3 + defaultFunc.sMt});
			       					}else{
			       						$this.ul.css(obj);
			       					}
	       						}else if(opt.type == 'gallery' || opt.type == 'gallery-loop'){
	       							if(l > 0){
		       							obj[(opt.axis == 'y' ? 'marginTop' : 'marginLeft')] = Math.abs(l)/3;
			       						$this.ul.css(obj);
			       					}else if(l < $this.galleryMaxMG && opt.axis != 'y'){
			       						$this.ul.css({marginLeft: (l - $this.galleryMaxMG)/3 + $this.galleryMaxMG });
			       					}else if(l < -$this.maxPage*$this.li.height() && opt.axis == 'y'){
			       						$this.ul.css({marginTop: (l - $this.galleryMaxMG)/3 + $this.galleryMaxMG });
			       					}else{
			       						$this.ul.css(obj);
			       					}
	       						}else{
		       						$this.ul.css(obj);
		       					}
	       					}
	       				}
	       			})
	       			.on(END_EV, function(e){
	       				$this.addInterval();
	       				$this.isHover = false;
	       				//
	       				if(hasTouch && $this.isStopElem()){
	       					if(opt.type == 'scroll' || opt.type == 'scroll-loop'){
		       					var ulMl = $this.getUlMl()
		       						, ulMt = $this.getUlMt()
		       						, liW = $this.getLiW()
		       						, liH = $this.getLiH();

		       					if(Math.abs(defaultFunc.sMl - ulMl) > (isAndroid ? 10 : 25) 
		       						|| Math.abs(defaultFunc.sMt - ulMt) > (isAndroid ? 10 : 25)){
		       						if(opt.axis == 'y'){
		       							$this.curPage = Math.ceil(Math.abs(ulMt/liH)) - (defaultFunc.sMt > ulMt ? 0 : 1);
		       						}else{
		       							$this.curPage = Math.ceil(Math.abs(ulMl/liW)) - (defaultFunc.sMl > ulMl ? 0 : 1);
		       						}	       						
			       					$this.curPage = $this.curPage > $this.maxPage ? $this.maxPage : $this.curPage;
		       					}
				       			defaultFunc.mx && $this.scroller($this.curPage);
				       		}else if(opt.type == 'fade'){
				       			if( defaultFunc.mx == 0 ){
				       				$this.curPage = $this.curPage;
				       			}else if(Math.abs(defaultFunc.sx - defaultFunc.mx) > (isAndroid ? 10 : 25)){
				       				$this.curPage = defaultFunc.sx > defaultFunc.mx ? $this.curPage + 1 : $this.curPage - 1;
				       			}
				       			if($this.curPage < 0) {
					       			$this.curPage = opt.loop ? $this.maxPage : 0;
					       		}
					       		if($this.curPage > $this.maxPage) {
					       			$this.curPage = opt.loop ? 0 : $this.maxPage;
					       		}
				       			$this.scroller($this.curPage);
				       		}else if(opt.type == 'gallery' || opt.type == 'gallery-loop'){
				       			var o = $.spice.getEventXY(e);

				       			defaultFunc.eMoveTime = new Date().getTime();
				       			
				       			if(opt.axis == 'y'){
				       				var v = ( o.y - defaultFunc.sy ) / ( defaultFunc.eMoveTime - defaultFunc.sMoveTime );
				       			}else{
				       				var v = ( o.x - defaultFunc.sx ) / ( defaultFunc.eMoveTime - defaultFunc.sMoveTime );
				       			}
				       			(function (v, startTime, contentY) {
					        		var dir = v > 0 ? - 1 : 1;

					        		//加速度方向
				        			var deceleration = dir * 0.005;
				        			function inertiaMove() {
										var nowTime = new Date().getTime();
										var t = nowTime - startTime;
										var nowV = v + t * deceleration;
										var moveY = (v + nowV) / 2 * t;
										var obj = {}
											, curUlNum = 0;
										if(opt.axis == 'y'){
											curUlNum = $this.getUlMt();
										}else{
											curUlNum = $this.getUlMl();
										}
										if (dir * nowV > 0) {
											//惯性滚动结束后，计算当前滚动的位置对应的页数
											if(opt.axis == 'y'){
							       				$this.curPage = parseInt(Math.abs(curUlNum/$this.getLiH()));
							       			}else{
							       				$this.curPage = parseInt(Math.abs(curUlNum/$this.getLiW()));
							       			}
							       			defaultFunc.galleryDisabledBtn($this, curUlNum);
							       			opt.callBack && $.isFunction(opt.callBack) && opt.callBack($this.curPage, $this);
											return;
										}
										var move = contentY + moveY;
										//如果滑动距离超过最大或最小值，回到最大值或最小值
										if(move <= $this.galleryMaxMG){
											curUlNum = $this.galleryMaxMG;
											obj[(opt.axis == 'y'?'marginTop':'marginLeft')] = curUlNum;
											defaultFunc.galleryDisabledBtn($this, curUlNum);
											$this.ul.animate(obj, 'normal', function(){
												opt.callBack && $.isFunction(opt.callBack) && opt.callBack($this.curPage, $this);
											});
											return false;
										}
										if(move >= 0){
											curUlNum = 0;
											obj[(opt.axis == 'y'?'marginTop':'marginLeft')] = curUlNum;
											defaultFunc.galleryDisabledBtn($this, curUlNum);
											$this.ul.animate(obj, 'normal', function(){
												opt.callBack && $.isFunction(opt.callBack) && opt.callBack($this.curPage, $this);
											});
											return false;
										}
										obj[(opt.axis == 'y'?'marginTop':'marginLeft')] = move;
										$this.ul.css(obj);
										setTimeout(inertiaMove, 10);
				        			}
				        			inertiaMove();

					        	})(v, defaultFunc.eMoveTime, (opt.axis == 'y'?$this.getUlMt():$this.getUlMl()));
				       		}
	       				}
	       			});

       			});
       			
	    }
	    , getDotHtml: function(liLength, self){
	    	var dot = self.opt.dot
	    		, style = dot.style;
	    	if(self.opt.type != 'gallery' || self.opt.type != 'gallery-loop'){
	    		if(style && liLength > 1){
		    		var dotHtml = '<div class="scroll-dots">';
		    		for(var i = 1; i <= liLength; i++){
		    			if(style == 'dot'){
		    				dotHtml += '<a' + (i == 1 ? ' class="active"' : '') + '>' + i + '<i></i></a>';
		    			}else if(style == 'text'){
		    				dotHtml += '<a class="dots-text' + (i == 1 ? ' active' : '') + '">' + (self.li.eq(i - 1).attr('data-title') || i) + '<i></i></a>';
				    	}else if(style && $.isFunction(style)){
				    		dotHtml += style(self.li.eq(i - 1)) || '';
				    	}
		    		}
			    	dotHtml += '</div>';
			    	$('.scroll-dots', self.elem).remove();
			    	self.elem.append(dotHtml);
			    	$('.scroll-dots > *:eq(0)', self.elem).addClass('active');
		    	}
	    	}
	    }
	    , disabledBtn: function(self){
	    	if( !self.opt.loop ){
				var $btnPrev = self.btnPrev
		    		, $btnNext = self.btnNext
		    		, maxPage = self.maxPage
		    		, page = self.curPage;
		        if(page >= maxPage){
		            $btnPrev.removeClass('is-disabled');
		            $btnNext.addClass('is-disabled');
		        }
		        if(page == 0){
		            $btnPrev.addClass('is-disabled');
		            $btnNext.removeClass('is-disabled');
		        }
		        if( page > 0 && page < maxPage){
		            $btnPrev.removeClass('is-disabled');
		            $btnNext.removeClass('is-disabled');
		        }
	    	}
	    }
	    , galleryDisabledBtn: function(self, ulNum){
	    	var $btnPrev = self.btnPrev
		    	, $btnNext = self.btnNext
		    	, galleryMaxMG = self.galleryMaxMG;

		    if( ulNum < 0 ){
		    	$btnPrev.removeClass('is-disabled');
		    	if( ulNum > galleryMaxMG){
		    		$btnNext.removeClass('is-disabled');
		    	}else{
		    		$btnNext.addClass('is-disabled');
		    	}
		    }else{
		    	$btnPrev.addClass('is-disabled');
		    	$btnNext.removeClass('is-disabled');
		    }

	    }
	}

	var kvScroll = function(self, option){
	    var $self  = this;
	    $self.opt = $.extend({}, defaultOptions, option);
	    $self.elem = self;

	    if(!defaultFunc[$self.opt.type]) return false;
	    //初始化变量
	    //当前位置	    
	    $self.btnPrev 	= $('.scroll-btn-prev', self);
	    $self.btnNext = $('.scroll-btn-next', self);
	    $self.ul 	= $('ul:eq(0)', self);

        $self.init();
	}

	kvScroll.prototype = {
	    init: function(){
	    	var $this = this
	    		, opt = $this.opt
                , elem = $this.elem
                , $ul = $this.ul;

            var $li = $this.li = $('>li', $ul);

            //重置参数
            $this.curPage = 0;
            $this.destroy();

            $li = $this.li = $('>li', $ul);

        	var liLength = $this.liLength = $li.length
            	, initMG = $this.initMG = 0;

            defaultFunc.getDotHtml(liLength, $this);

            $this.dots 	= $('.scroll-dots', elem);
	    	$this.dotsA = $('> *', $this.dots);

   			var wait = function (dtd) {
			  var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
			  var tasks = function () {
			  	var src = $('img:eq(0)', $li).attr('src');
			    //
			    if(src){
			    	$('<img src="'+ $('img:eq(0)', $li).attr('src') +'">').load(function(){
				    	dtd.resolve(); // 改变Deferred对象的执行状态
				    });
			    }else{
			    	dtd.resolve();
			    }
			  };
			  tasks();
			  return dtd.promise(); // 返回promise对象
			};

			$.when(wait()).done(function () {
				$this.maxPage = liLength - 1;

				var H = $this.getLiH();

	            if(opt.type == 'scroll-loop' && opt.loop){
	            	if(liLength > 1){
	            		var $cloneLiFirst = $li.first().clone(true).addClass('kvScroll-Clone')
		            		, $cloneLiLast = $li.last().clone(true).addClass('kvScroll-Clone');
				        $ul.append($cloneLiFirst).prepend($cloneLiLast);
				        liLength = $this.liLength = liLength + 2;
				        if(opt.axis == 'y'){
				        	initMG = $this.initMG = -H+'px';
				        }else{
				        	//initMG = $this.initMG = '-100%';
				        	initMG = $this.initMG = -$ul.parent().width();
				        }
				        $this.maxPage = liLength - 1;
				        $this.curPage = 1;
	            	}
	            }
	            
	            if(opt.type == 'fade'){
	            	/*$(window).resize(function(){
			        	$ul.css({height: 'auto'});
			        	$li.css({height: 'auto'});
			        	H = $this.getLiH();
			        	$ul.css({height: H});
			        	$li.css({height: H});
			        }).resize();
			        $li.css({width: '100%', position: 'absolute', left: 0}).hide();
			        $li.eq(0).show();*/
	            }else if(opt.type == 'gallery' || opt.type == 'gallery-loop'){

	            	$(window).on('resize.gallery', function(){

	            		if( !$this.elem.data('spice.kvScroll') ){
	            			return false;
	            		}

	            		var liW = $this.getLiW(), liH = $this.getLiH(), divW = $this.getDivW(), divH = $this.getDivH();
	            		$this.curPage = 0;

	            		if(opt.type == 'gallery-loop' && opt.loop && $('li.kvScroll-Clone', $ul).length == 0 && !hasTouch){
	            			var num = Math.ceil(divW/liW);
	            			if(divW < liLength*liW){
		            			var liHtml = $('>li:not([class*=kvScroll-Clone])', $ul);
		            			$ul.append( liHtml.clone(true).addClass('kvScroll-Clone') ).append( liHtml.clone(true).addClass('kvScroll-Clone') );
	            			}
	            		}
	            		
		        		$ul.css({marginLeft: initMG, marginTop: 0});
		        		divW = $this.getDivW();
		        		divH = $this.getDivH();
		        		
		        		if(opt.axis == 'y'){
		        			var showNum = parseInt(divH/liH);
		        		}else{
		        			var showNum = parseInt(divW/liW);
		        		}
		        		//如果设定的滚动个数大于显示区域可显示的个数
		        		//则自动设置为最大的显示个数
		        		$this.moveNum = showNum < opt.moveNum ? showNum : opt.moveNum;
		        		$this.maxPage = Math.ceil((liLength - showNum)/$this.moveNum);

						if(opt.axis == 'y'){
							$this.galleryMaxMG = -liH*liLength + divH;
						}else{
							$this.galleryMaxMG = -liW*liLength + divW;
						}
						
		        	}).trigger('resize.gallery');
	            	if($this.maxPage <= 0) {
	            		defaultFunc.disabledBtn( $this );
	            		opt.callBack && $.isFunction(opt.callBack) && opt.callBack($this.curPage, $this);
	            		return false;
	            	}

	            }else{
	            	if(opt.axis == 'y'){
	            		$(window).on('resize.scroll', function(){
	            			if( !$this.elem.data('spice.kvScroll') ){
		            			return false;
		            		}
	            			H = $this.getLiH();
	            			$('.scroller-wrap', $this.elem).css({ height: H });
	            		}).trigger('resize.scroll');
	            		$ul.css({ marginTop: initMG });
	            		$('>li', $ul).css({display: 'block'});
	            	}else{
	            		$ul.css({width: 100*(liLength) + '%', marginLeft: initMG});
	            		$('>li', $ul).css({width: 100/(liLength) + '%'}).css({display: 'block'});
	            		$(window).on('resize.scroll', function(){
	            			if( !$this.elem.data('spice.kvScroll') ){
		            			return false;
		            		}
	            			$ul.css({marginLeft: -$this.curPage*100 + '%' });
	            			$ul.css({marginLeft: -$this.curPage*$this.getLiW() + 'px' });
	            		});
	            	}
	            }

	            $this.li = $('>li', $ul);

	            //重置参数
	            if(opt.axis != 'y'){
	            	var dotW = ( $this.opt.type == 'scroll-loop' && $this.opt.loop ? $this.li.length - 2 : $this.li.length )*$this.dotsA.outerWidth(true);
	        		$this.dots.css({width: dotW, left: '50%', marginLeft: -dotW/2});
	            }

		       	var btnHtml = '<div class="scroll-btn-prev' + (liLength <= 1 || $this.maxPage == 0 || !$this.opt.btn ? ' none' : '') + '">\
									<a><i>' + (opt.axis == 'y' ? '&and;' : '&lt;') + '</i></a>\
								</div>\
								<div class="scroll-btn-next' + (liLength <= 1 || $this.maxPage == 0 || !$this.opt.btn ? ' none' : '') + '">\
									<a><i>' + (opt.axis == 'y' ? '&or;' : '&gt;') + '</i></a>\
								</div>';

				$this.elem.append( btnHtml );

				$this.btnPrev = $('.scroll-btn-prev', $this.elem);
				$this.btnNext = $('.scroll-btn-next', $this.elem);

		       	$this.initDotsAClass(0);

	            //右边按钮
	            $this.btnNext.off('.kvScroll').on('tap', function(){
	            	$this.next();
	            });

	            //左边按钮
	            $this.btnPrev.off('.kvScroll').on('tap', function(){
	            	$this.prev();
	            });

	            //焦点
	            $this.dotsA.off('.kvScroll').on(opt.dot.dotsEvent || 'tap', function(){
	            	if($this.isNotAnimate()){
		    			var curPage = $this.curPage = $(this).index();
	            		$this.scroller( (opt.type == 'scroll-loop' ? curPage + 1 : curPage) );
		    		}
	            });

	            $this.addInterval();
	            defaultFunc.scrollHover($this);
	            defaultFunc.disabledBtn( $this );
	            opt.callBack && $.isFunction(opt.callBack) && opt.callBack($this.curPage, $this);
			}).fail(function () {});

	    }
	    , next: function(){
	    	var $this = this;
	    	if($this.isNotAnimate()){
	    		var curPage = ++$this.curPage, maxPage = $this.maxPage;
		    	if(curPage > maxPage) {
	       			curPage = $this.curPage = $this.opt.loop ? 0 : maxPage;
	       		}
		    	this.scroller(curPage, 'next');
	    	}
	    }
	    , prev: function(){
	    	var $this = this;
	    	if($this.isNotAnimate()){
	    		var curPage = --$this.curPage, maxPage = $this.maxPage;
		    	if(curPage < 0) {
	       			curPage = $this.curPage = $this.opt.loop ? maxPage : 0;
	       		}
		    	this.scroller(curPage, 'prev');
	    	}
	    }
	    , scroller: function(page, c){
	    	var $this = this
	    		, opt = $this.opt
	    		, $ul = $this.ul
	    		, $li = $this.li;
	    	if($this.isNotAnimate()){
	    		$this.removeInterval();
	    		defaultFunc[opt.type](this, page, c);
       		}
	    }
	    , initDotsAClass: function(index){
	    	$('.scroll-dots > *', this.elem).eq(index).addClass('active').siblings().removeClass('active');
	    }
	    , isNotAnimate: function(){
    		var sz = [ this.ul.is(':not(:animated)') ];
    		$.each(this.li, function(i, elem){
    			sz.push( $(elem).is(':not(:animated)') );
    		});
	    	return $.inArray(false, sz) < 0;
	    }
	    , addInterval: function(){
	    	var $this = this;
	    	if( !this.isStop ){
	    		$this.removeInterval();
		    	var interval = setInterval(function(){
					$this.opt.autoPlay && $this.next();
				}, $this.opt.time);
				$this.elem.data('interval', interval);
	    	}
	    }
	    , removeInterval: function(){
	    	var interval = this.elem.data('interval');
	    	interval && clearInterval(interval);
	    }
	    , getLiW: function(){
			return +this.li.outerWidth(true);
		}
	    , getLiH: function(){
			return +this.li.outerHeight(true);
		}
		, getDivW: function(){
			return +$('>div', this.elem).width();
		}
		, getDivH: function(){
			return +$('>div', this.elem).height();
		}
		, getUlMl: function(){
			return +this.ul.css('marginLeft').replace(/px/ig, '');
		}
		, getUlMt: function(){
			return +this.ul.css('marginTop').replace(/px/ig, '');
		}
		, isStopElem: function(){
   			if(hasTouch && this.opt.stopElem){
   				return $(this.opt.stopElem + ':visible', this.li).length == 0;
   			}
   			return true;
   		}
	    /*
		 * 开始轮播
	     */
	    , start: function(){
	    	this.isStop = false;
	    	this.addInterval();
	    }
	    /*
		 * 暂停轮播
	     */
	    , stop: function(){
	    	this.isStop = true;
	    	this.removeInterval();
	    }
	    /*
		 * 删除轮播
	     */
	    , destroy: function(){
	    	this.removeInterval();
	    	this.ul.removeAttr('style');
	    	this.li.removeAttr('style');
	    	$('.scroller-wrap', this.elem).removeAttr('style');
	    	
	    	this.li.remove('.kvScroll-Clone');

	    	$('.scroll-dots', this.elem).remove();
	    	$('.scroll-btn-prev', this.elem).remove();
	    	$('.scroll-btn-next', this.elem).remove();

	    	this.btnNext.off();
	    	this.btnPrev.off();

	    	$('.scroll-dots > *', this.elem).off();
	    	this.elem.off();
	    	this.ul.off();
	    	this.elem.removeData('spice.kvScroll');
	    }
	}

	function plugin(selector, option) {
		if( !(selector && !$.isPlainObject(selector)) ) return false;
	    var rtn = [];
	    $(selector).each(function(index, self){
	        var $self = $(self)
	            , data  = $self.data('spice.kvScroll');
	        if (data){
	        	data.destroy();
	        }
	        $self.data('spice.kvScroll', (data = new kvScroll($self, option)));
	        rtn.push(data);
	    });
	    return rtn;
	}

	//$.fn.kvScroll             = plugin;
	//$.fn.kvScroll.Constructor = kvScroll;
	$.spice.kvScroll = plugin;

})(jQuery);