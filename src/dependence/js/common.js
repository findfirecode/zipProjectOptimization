var cartIsEmpty = false;
var isSaLogin = false;
var commonloginstatus = false;// 是否登录成功
var buildCouponDataFalg = false;// 构建首页优惠券数据成功标记 cookie构建成功那么将不请求后台
var extCodes = "";
var codeConfirm = null;// 验证码弹层
var LoginConfirm = null;// 登录弹层
var registerConfirm = null;// 注册验证弹层
var loginAlertConfirm = null;// 登录提示弹层
var noChinaMemberLoginDialog = null;// 非中国用户登录提示弹层
var cartNumUseForNewIndex = '0'
/** 测试人员登录名 只用于分期付款 */
var testLoginName = "";
/** 存放用户名cookie的 key */
var memberCookieKey = "MEMBER_NAME_COOKIE_KEY";
/** 存放是否中国账号cookie的 key */
var memberAccountCHNCookieKey = "CHN_ACCOUNT";
/** **首页优惠券cookie 数据 * */
var indexCouponDataCookieKey = "INDEX_COUPON_ICON_COOKIE_KEY";
/** 存放用户类型cookie的 key */
var memberTypeCookieKey = "MEMBER_TYPE_COOKIE_KEY";
/** **唤起S助手 用 Cid key * */
var cidCookieKey = "CID_COOKIE_KEY";
var userAgent = window.navigator.userAgent;
/** 加载最新首页数据URL */
var findIndexPageViewCommandUrl = base + "/findIndexPageViewData.json";

$(function() {
	// 第三方登陆
	goToLogin();
	// 商城端登录
	stoAutoLogin();
	loadNum();
	// 存储spice对象
	var spc = $.spice, $window = $(window);

	spc.getScrollbarWidth = function() {
		if (spc.android) {
			return 0;
		} else {
			var p = document.createElement('p'), styles = {
				width : '100px',
				height : '100px',
				overflowY : 'scroll'
			}, i, scrollbarWidth;
			for (i in styles)
				p.style[i] = styles[i];
			document.body.appendChild(p);
			scrollbarWidth = p.offsetWidth - p.clientWidth;
			$(p).remove(); // lu
			return scrollbarWidth;
		}
	}
	// 如果该页面没有引入 jquery.spice.js 则不执行一下操作
	if (!spc || $.isEmptyObject(spc))
		return false;

	// 用于存储其他的公用方法
	SAM = window.SAM || {};
	SAM.mask = $.spice.mask();
	// 以下写其他代码

	SAM.citySelect = function(s, fn) {
		$.spice.citySelect(s, {
			defaultText : [ '请选择省', '请选择市', '请选择区' ],
			btnClass : '.events-city-text',
			contentClass : '.events-city-content',
			events : function($subMenu) {
				$.spice.tinyscrollbar($subMenu
						.removeData('plugin_tinyscrollbar'));
			},
			callBack : function(val, elem) {
				fn(val, elem);
				// 验证省市区是否选择
				$(".events-city-content").on("click", function() {
					validateAddress();
				});
			}
		});
	};

    $window.on('scroll.iframe', function() {
        $.each($('iframe'), function(i, ifm) {
        	if(ifm.src.indexOf(window.location.host) < 0) return

            var $ifm = $(ifm),
                ifmOffsTop = $ifm.offset().top,
                $lazyImg = $ifm.contents().find('img[lazy_src]'),
                h = $ifm.contents().find('[data-type=pdp-page-wrapper]').height();
            if ($ifm) {
                if ($lazyImg.length == 0) {
                    $ifm.css({
                        height: h,
                        minHeight: h
                    });
                } else {
                    $.each($lazyImg, function(i, elem) {
                        var $img = $(elem),
                            lazySrc = $img.attr('lazy_src'),
                            offsTop = $img.offset().top,
                            st = $window.scrollTop();

                        if (st + $window.height() > offsTop + ifmOffsTop - 100) {
                            $img.attr('src', lazySrc);
                            $img.removeAttr('lazy_src');
                            $ifm.css({
                                height: h,
                                minHeight: h
                            });
                        }
                    });

                }
            }
        });
    });




	// 获取iframe高度
	SAM.iframeHeight = function(elem) {
		$.each($(elem), function(i, ifm) {
			var $ifm = $(ifm);
			// 用于每次刷新时控制IFRAME高度初始化
			$ifm.height(0);

            if($(window).width() < 1024) {
                $ifm.css({
                    width : $(window).width() + 'px'
                });
			}else{
                $ifm.css({
                    width : '100%',
                    maxWidth: "1440px"
                });
			}
			var ifmWidow = $ifm.get(0).contentWindow
			if (!ifmWidow || !ifmWidow.innerHeight) return
			$ifm.css({
				height : ifmWidow.innerHeight,
				minHeight : ifmWidow.innerHeight
            });
			$window.trigger('scroll.iframe');
		});
	}

	SAM.iframeLoad = function(iframeId, iframeSrc) {
		if (!iframeId || !iframeSrc)
			return false;
		if ($('#' + iframeId).length == 0) {
			$('.events-sam-product-detail-promotion')
					.append(
							'<iframe id="'
									+ iframeId
									+ '" src="'
									+ iframeSrc
									+ '?spiceflag='
									+ (new Date()).getTime().toString()
									+ '"frameborder="0"  scrolling="no" ></iframe>');
			$(window).off('resize.iframeHeight').on('resize.iframeHeight',
					function() {
						SAM.iframeHeight('#' + iframeId);
						console.log(22222);
					}).trigger('resize.iframeHeight');
			$('#' + iframeId).on('load', function() {
				$window.trigger('scroll.iframe');
			});
		}
		// }});
	}
	// 原图旁边放大
	if (!!spc.cloudZoom) {
		SAM.cloudZoom = function(options, elem) {
			var $cloudzoom = $(elem || '.events-cloudzoom');
			if ($cloudzoom.length != 0) {
				$('.cloudzoom-blank').remove();
				$.each($cloudzoom, function(i, elem) {
					var cloudZoom = $(elem).data('CloudZoom');
					cloudZoom && cloudZoom.destroy();
					var o = $.extend({}, {
						animationTime : 300,
						easeTime : 0,
						zoomWidth : 650,
						zoomHeight : 650,
						zoomOffsetX : 0
					}, options);
					$.spice.cloudZoom($(elem), o);
				});
			}
		}
		SAM.cloudZoom();
	}

	// LU
	// 滚动条
	SAM.iScroll = function(elem, options) {
		var $elem = $(elem), iScrollData = $elem.data('iScroll'), o = $.extend(
				{}, {
					mouseWheel : true,
					preventDefault : spc.android ? false : true
				}, options);
		// 如果是第二次调用
		// 刷新滚动插件
		if (iScrollData) {
			iScrollData.refresh();
		} else {
			!spc.android && spc.hasTouch
					&& $elem.data('iScroll', new IScroll(elem, o));
		}
	};

	// 秒杀
	SAM.getQueueDialog = function(options) {
		var o = {
			title : '',
			text : '',
			status : {
				classes : '',
				text : ''
			},
			btn : {
				classes : '',
				text : ''
			}
		}
		o = $.extend({}, o, options);
		var iconClass = o.status.classes, btnClass = o.btn.classes;
		return '<div class="dialog dialog-queue">'
				+ '<div class="dialog-container">'
				+ '<p class="dialog-queue-title">' + (o.title || '') + '</p>'
				+ '<p class="dialog-queue-notice">' + (o.text || '') + '</p>'
				+ '<div class="float-clearfix dialog-queue-status">'
				+ '<label>' + '<i class="icon'
				+ (iconClass ? ' ' + iconClass : '') + '"></i>'
				+ (o.status.text || '') + '</label>' + '<a class="btn'
				+ (btnClass ? ' ' + btnClass : '') + '">' + (o.btn.text || '')
				+ '</a>' + '</div>' + '</div>'
				+ '<i class="icon icon-close dialog-close">&times;</i>'
				+ '</div>';
	}

	// 根据window宽度增删类
	$(window).resize(
			function(event) {
				var $self = $(this), wW = $self.width()
						+ $.spice.getScrollbarWidth(); // lu

				$('.navbar-menu > .nav').removeClass(
						'events-menu-pc events-menu-pad').addClass(
						wW > 1024 ? 'events-menu-pc' : 'events-menu-pad');
				$('.top-cart')[wW > 767 ? 'addClass' : 'removeClass']
						('events-minicart');
				$('.footer-top .footer-container')[wW < 767 ? 'addClass'
						: 'removeClass']('events-footer-menu');
				if (wW > 767) {
					$('.footer-top .footer-submenu').removeAttr('style');
					$('.events-m-search-res').removeAttr('style');
					$('html,body').removeAttr('style');
				}
				// mobile paid 不显示加入书签
				if (wW < 1024) {
					$('#sc').hide();
				}

				// 消除pad导航显示对pc的影响
				if (wW > 1024) {
					$('#wrapper').removeAttr('style');
					$('.events-m-menu-res').removeAttr('style');
					if (!($('.events-dialog-update').length != 0 && $(
							'.events-dialog-update').is(':visible'))) {
						SAM.mask.hide();
					}
					// lu
					$('li', '.events-menu-pc').removeClass('active');
					$('.sub-menu', '.events-menu-pc').removeAttr('style');
				}

				// 屏幕缩放时收起侧边导航
				$('#wrapper').css({
					left : 0
				});
				if (!($('.events-dialog-update').length != 0 && $(
						'.events-dialog-update').is(':visible'))) {
					SAM.mask.hide();
				}
				$('#wrapper').removeAttr('style');
				$('html,body').removeAttr('style');
				$('.events-m-menu-res').css({
					right : '-245' + 'px'
				});
			}).resize();

	// 导航吸顶
	if ($('.header').length != 0) {
		var headerOffsetT = $('.header').offset().top;
	}
	// var headerOffsetT = $('.header').offset().top;
	$(window).scroll(
			function() {
				var wH = $(window).scrollTop()
				var containerTop = $('.container').length ? $('.container').offset().top- wH : 0

				// 兼容顶部通栏
				if(!$('#topFenceContent').is(':hidden')) {
					headerOffsetT = $('#topFenceContent').height()
				}else {
					headerOffsetT = $('.nav-container.float-clearfix')[0].clientHeight
				}

				$('.header')[wH > headerOffsetT ? 'addClass' : 'removeClass']
						('header-fixed');
				$('.container')
						.css(
								{
									paddingTop : ($('.header').hasClass(
											'header-fixed') ? containerTop : 0)
								});

				// 回到顶部显示
				$('.events-backtop')[wH > 200 ? 'addClass' : 'removeClass']
						('active');

			}).scroll();

	$('.events-backtop').on('tap', function() {
		$('html,body').animate({
			scrollTop : 0
		}, 500);
	});

	var _w = $(window).width();
	var _h = $(window).height();

	// 导航下拉
	var loggedMenuTime = null;
	$('.events-logged').live('mouseenter', function() {
		if (_w > 1024) {
			var _this = $(this);
			if (_this.find('.sub-menu').is(':hidden')) {
				loggedMenuTime = setTimeout(function() {
					_this.find('.sub-menu').stop(true, true).fadeIn('fast');
				}, 100);
			}
		}
	}).live('mouseleave', function() {
		if (_w > 1024) {
			clearTimeout(loggedMenuTime);
			$('.sub-menu', this).stop(true, true).fadeOut('fast');
		}

	});

	// 召唤收索
	$('.events-search-box > a').on(
			'tap',
			function() {
				var _this = $(this), _thisParents = _this
						.parents('.events-search-box');

				$('.sub-menu', _thisParents).stop(true, true).slideToggle(300);
			});

	$('.eventssearch-clear').on('tap', function() {
		$('.events-search-box .sub-menu').stop(true, true).slideUp(300);
	});

	// 点击搜索
	$('.events-search')
			.on(
					'tap',
					function() {
						var _this = $(this), _thisParents = _this
								.parents('.sub-menu'), searchVal = $('input',
								_thisParents).val();

						console.log(searchVal);
					});

	// 叉
	$('eventssearch-clear').on('tap', function() {
		$('.events-search-box .sub-menu').stop(true, true).slideUp(300);
	});

	// 召唤收索 end

	// 购物车
	var showMinicartTime = null;
	$('.events-cart').live('mouseenter', function() {
		// 当pc 并且 购物车数量大于1时，才能打开
		var _this = $(this);
		if (_this.find('.sub-menu').is(':hidden')) {
			showMinicartTime = setTimeout(function() {
				loadShoppingCart();
			}, 100);
		}
	}).live('mouseleave', function() {
		if (_w > 1024) {
			clearTimeout(showMinicartTime);
			$('.events-minicart-res').stop(true, true).slideUp('fast');
		}

	});

	// 购物车 删除商品
	$('.events-cart-delete')
			.live(
					'tap',
					function() {
						var _this = $(this), _thisParents = _this
								.parents('li.float-clearfix');

						_thisParents
								.fadeOut(
										'400',
										function() {
											_thisParents.remove();

											$('.events-minicart-scrollbar')
													.removeData(
															'plugin_tinyscrollbar');
											$.spice
													.tinyscrollbar(
															'.events-minicart-scrollbar',
															{
																wheelLock : true,
																touchLock : false
															});

											// 当商品数量小于1 关闭购物车
											// var cartLi = $('.mini-cart-list
											// ul li'),
											// cartLiLength = cartLi.length;
											var cartLiLength = getCookie('g_c_s_cnt');
											var shopCartNum = 0;
											// 判断是否为数字
											if (!isNullOrEmpty(cartLiLength)
													&& !isNaN(Number(cartLiLength))) {
												shopCartNum = cartLiLength;
											}

											if (cartLiLength < 1) {
												$('.mini-cart-list').css({
													padding : '0'
												});

												$('.events-minicart-res').stop(
														true, true).slideUp(
														'fast');

												// 购物车显示为空状态
												$('.events-cart > a')
														.removeAttr('value');
												$('.events-cart').addClass(
														'is-empty');
											}

											// 更新购物车显示数量
											$('.events-cart > a').attr('value',
													shopCartNum);

											// 删减商品时禁止购物车滚动
											var $tinyBar_Disable = $('.events-minicart-res .scrollbar.disable');
											var $tinyBar_Overview = $tinyBar_Disable
													.siblings('.viewport')
													.find('.overview');
											if ($tinyBar_Disable) {
												$tinyBar_Overview
														.addClass('active');
											} else {
												$tinyBar_Overview
														.removeClass('active');
											}
										});
					});
	// 购物车 end

	// 导航下拉
	var subMenuTime;
	$('.events-navbar-menu .nav-pills > li').live('mouseenter', function() {
		if (_w > 1024) {
			var _this = $(this);
			if (_this.find('.sub-menu').is(':hidden')) {
				subMenuTime = setTimeout(function() {
					_this.addClass('open');
					_this.find('.sub-menu').stop(true, true).slideDown('fast');

				//	顶部通栏造成样式问题
					if(!$('#topFenceContent').is(':hidden')) {
						var offsetTop = 101 + $('#topFenceContent').height()
						if($('.header-fixed').length) {
							_this.find('.sub-menu').css("top", "");
						}else {
							_this.find('.sub-menu').css("top", offsetTop + "px")
						}
					} else {
						_this.find('.sub-menu').css("top", "");
					}
				}, 100);
			}
		}
	}).live('mouseleave', function() {
		if (_w > 1024) {
			$(this).removeClass('open');
			clearTimeout(subMenuTime);
			$('.sub-menu', this).stop(true, true).slideUp('fast');
		}

	});
	// 导航下拉 end

	// mobile侧边栏
	var $mobSliderBox = $('.mob-slider-box'), IScrollMenu = null;

	if ($('.events-header-scroll').length != 0) {
		var IScrollMenu = new IScroll('.events-header-scroll', {
			mouseWheel : true,
			preventDefaultException : {
				tagName : /^(INPUT|TEXTAREA|BUTTON|SELECT|A|DIV|SPAN|P|I)$/
			}
		});
	}
	// 召唤侧边栏
	$('.events-mob-menu').on(
					'tap',
					function() {
						var _this = $(this), _thisHasOpen = _this
								.hasClass('is-open');

						$('.events-header-scroll').height(_h - 44 + 'px');

						if (_w <= 1024) {

							if (!_thisHasOpen) {
								if ($('.banner-section .events-scroll').length) {
									// 展开侧边栏，暂停轮播
									$('.banner-section .events-scroll').data(
											'spice.kvScroll').stop();
								}
								_this.addClass('is-open');
								$('.header').addClass('menu-open');

								$mobSliderBox.show();
								$mobSliderBox.stop(true, true).animate({
									left : 0
								}, 400, function() {
									$('html,body').css({
										'overflow' : 'hidden',
										'position' : 'fixed',
										'height' : '100' + '%'
									});
									IScrollMenu.refresh();
								});
							} else {
								_this.removeClass('is-open');

								// 关闭侧边栏，恢复轮播
								if ($('.banner-section .events-scroll').length) {
									$('.banner-section .events-scroll').data(
											'spice.kvScroll').start();
								}

								$mobSliderBox
										.stop(true, true)
										.animate(
												{
													left : -100 + '%'
												},
												300,
												function() {
													// console.log('侧边栏隐藏');
													$mobSliderBox.hide();
													$('.header').removeClass(
															'menu-open');
													$('html,body').removeAttr(
															'style');

													// 关闭二级菜单
													$(
															'.nav-pills > li .sub-menu, .events-logged .sub-menu',
															$mobSliderBox)
															.stop(true, true)
															.animate(
																	{
																		left : -100
																				+ '%'
																	}, 0);

													$(
															'.nav-pills > li .sub-menu, .events-logged .sub-menu',
															$mobSliderBox)
															.hide();
												});
							}
						}
					});
	// 召唤侧边栏 end

	// 召唤二级菜单
	$('.nav-pills > li > a', $mobSliderBox).on(
			'tap',
			function() {
				var _this = $(this), _thisParent = _this.parent();

				if (_w <= 1024) {
					$('.sub-menu', _thisParent).show();
					if ($('.sub-menu .submenu-wrap', _thisParent).outerHeight(
							true) > _h - 44) {
						$('.header-menu-content').height(
								$('.sub-menu .submenu-wrap', _thisParent)
										.outerHeight(true));
					} else {
						$('.header-menu-content').height(_h - 44 + 'px');
					}
					IScrollMenu.refresh();

					$('.sub-menu', _thisParent).stop(true, true).animate({
						left : 0
					}, 400);

					// 如果有下级菜单，禁用跳转
					if ($('.sub-menu', _this.parent()).length) {
						return false;
					}

				}
			});

	// 个人账户
	$('.events-logged > a', $mobSliderBox)
			.on(
					'tap',
					function() {
						var _this = $(this), _thisParent = _this.parent();

						if (_w <= 1024) {

							$('.sub-menu', _thisParent).show();
							if ($('.sub-menu > ul', _thisParent).outerHeight(
									true) > _h - 44) {
								$('.header-menu-content').height(
										$('.sub-menu > ul', _thisParent)
												.outerHeight(true));
							} else {
								$('.header-menu-content')
										.height(_h - 44 + 'px');
							}
							IScrollMenu.refresh();
							$('.sub-menu', _thisParent).stop(true, true)
									.animate({
										left : 0
									}, 400);

							// 如果有下级菜单，禁用跳转
							if ($('.sub-menu', _this.parent()).length) {
								return false;
							}

						}
					});

	// 召唤二级菜单 end

	// 召唤三级菜单
	$('.has-three-menu > li > a', $mobSliderBox).on(
			'tap',
			function() {
				var _this = $(this), _thisParent = _this.parent();

				if (_w <= 1024) {
					$('.three-menu-box', _thisParent).show();
					$('.three-menu-box', _thisParent).stop(true, true).animate(
							{
								left : 0
							},
							400,
							function() {

								if ($('.three-menu', _thisParent).outerHeight(
										true) > _h - 44) {
									$('.header-menu-content').height(
											$('.three-menu-box .three-menu',
													_thisParent).outerHeight(
													true));
								} else {
									$('.header-menu-content').height(
											_h - 44 + 'px');
									;
								}
								IScrollMenu.refresh();
							});

					// 如果有下级菜单，禁用跳转
					if ($('.sub-menu', _this.parent()).length) {
						return false;
					}

				}
			});

	// 召唤三级菜单 end

	// 菜单返回
	$('.events-menu-back').on('tap', function() {
		var _this = $(this), _thisParents = _this.parent();
		;

		if (_this.parents('.sub-menu').length) {
			_thisParents = _this.parents('.sub-menu');
		}
		if (_this.parents('.three-menu-box').length) {
			_thisParents = _this.parents('.three-menu-box');
		}

		_thisParents.stop(true, true).animate({
			left : -100 + '%'
		}, 300, function() {
			_thisParents.hide();
		});

		$('.header-menu-content').removeAttr('style');
		IScrollMenu.refresh();
	});
	// 菜单返回 end
	// mobile侧边栏 end

	$(window)
			.on(
					'resize.common',
					function() {
						_w = $(window).width() + $.spice.getScrollbarWidth();
						_h = $(window).height();

						$('.footer-top .footer-container')[_w < 767 ? 'addClass'
								: 'removeClass']('events-footer-menu');
						if (_w > 767) {
							$('.footer-top .footer-submenu')
									.removeAttr('style');
						}

						// 导航条内容移动
						if (_w > 1024) {
							// 清除mobile侧边栏效果
							var headerMenu = $('.header .mob-slider-box');
							if (IScrollMenu) {

								$('.events-m-menu').removeClass('is-open');
								IScrollMenu.destroy();
								$('.nav-pills .sub-menu, .three-menu-box',
										headerMenu).removeAttr('style');
								$(
										'.events-header-scroll .scroller-wrap,.header-menu-content,.events-header-scroll')
										.removeAttr('style');
							}

						} else {

						}
						// 导航条内容移动 end

					}).trigger('resize.common');

	// console.log(_w, _h);

	// footer mobile 菜单
	$('.events-footer-menu .footer-sub-menutitle').live(
			'tap',
			function() {
				var $self = $(this);
				$('.footer-submenu', $self.parent().siblings('li')).stop(true,
						true).slideUp('fast', function() {
					$(this).parent().removeClass('active');
				});
				if ($self.closest('.footer-top-left').length != 0) {
					$('.footer-submenu', '.footer-top-right').stop(true, true)
							.slideUp('fast', function() {
								$(this).parent().removeClass('active');
							});
				} else {
					$('.footer-submenu', '.footer-top-left').stop(true, true)
							.slideUp('fast', function() {
								$(this).parent().removeClass('active');
							});
				}
				$self.siblings('.footer-submenu').stop(true, true).slideToggle(
						'fast', function() {
							$(this).parent().toggleClass('active');
						});
				$('.footer-submenu', $self.siblings('.footer-submenu')).stop(
						true, true).slideUp('fast', function() {
					$(this).parent().removeClass('active');
				});

			});

	$("#toMiniPay").on('tap', function() {
		// toMiniPay();
		shoppingMiniCartSelect();
	});
	/** **********************************登录 开始******************* */
	// 导航登陆弹层
	LoginConfirm = $.spice.dialog({
		template : $('#dialog-template-login').html(),
		fixed : false,
		submit : function() {
		}
	});

	// 登陆框里记得邮件
	$(".dialog-checked-login").on("click", ".events-checked-emile", function() {
		$('.icon-checked', this).toggleClass('is-active');
	})

	// 登陆提示注册弹层
	registerConfirm = $.spice.dialog({
		type : 'confirm',
		dialogClass : 'dialog-confirm dialog-register',
		fixed : true,
		title : '注册成为三星中国的会员',
		content : '尊敬的三星会员，您登录的账号注册地为非中国地区，<br />请注册三星中国账号以获得更多会员福利。',
		button : [ '去注册', '先逛逛' ]
		// 已经完成付款
		,
		submit : function() {
			window.location.href = base + "/member/index/toRegister.htm";
		}
		// 重新支付
		,
		cancel : function() {
			registerConfirm.hide();
		}
	});

	// 登陆提示弹层
	loginAlertConfirm = $.spice.dialog({
		type : 'confirm',
		dialogClass : 'dialog-confirm dialog-register',
		fixed : true,
		title : '提示',
		content : '尊敬的三星会员，您的账号已登录，请刷新当前页面。',
		button : [ '确定', '取消' ]
		// 已经完成付款
		,
		submit : function() {
			location.reload();
		}
		// 重新支付
		,
		cancel : function() {
			loginAlertConfirm.hide();
		}
	});

	// 验证码弹层
	codeConfirm = $.spice.dialog({
		template : $('#dialog-template-confirm').html(),
		fixed : true,
		submit : function() {
		}
	});

	// 免息商品&非免息商品一起下单弹层
	interestFreeDialog = $.spice.dialog({
		template : $('#dialog-template-interest-free').html(),
		fixed : true,
		btnCloseClass : '.icon-close'
	});

	// 非中国用户登录弹层
	noChinaMemberLoginDialog = $.spice.dialog({
		template : $('#dialog-template-nochinamemberlogin').html(),
		fixed : true
	});

	// 免息商品 一起结算弹层提示 begin
	$(".singlesday-lottery .continue").on("mouseover", function() {
		$(this).css("background", "#1428a0");
	});
	$(".singlesday-lottery .return").on("mouseover", function() {
		$(this).css("background", "#1428a0");
	});
	$(".singlesday-lottery .continue").on("mouseout", function() {
		$(this).css("background", "#0074c2");
	});
	$(".singlesday-lottery .return").on("mouseout", function() {
		$(this).css("background", "#0074c2");
	});
	// 继续支付
	$(".singlesday-lottery .continue").on("tap", function() {
		window.location.href = base + "/order/checkOut.htm";
	});
	// 返回购物车
	$(".singlesday-lottery .return").on("tap", function() {
		window.location.href = base + "/shopping/cart.htm";
	});

	$(".events-login-out-m").on(
			'tap',
			function() {
				var data = loxia.syncXhr(loxia.encodeUrl(base
						+ "/member/logout.json"));
				if (data.isSuccess) {
					var _this = $(this), _thisParents = _this
							.parents('.navbar-right');
					_this.removeClass('block-sm');
					$('.events-logged', _thisParents).addClass('none');
					$('.events-login', _thisParents).removeClass('none');
					$("#status").val(0);
					isSaLogin = true;

					// 三星api 需要访问才能登出，使用jsonp跨域
					$.ajax({
						url:data.returnUrl,
						dataType:"jsonp",
						jsonpCallback:"login",
						success:function (data1) {
                            console.log(data1);
                        }
					});

                    window.location.href = base + "/index.htm";
				}
			});

	$(".events-cancellation").on(
			'tap',
			function() {
				var data = loxia.syncXhr(loxia.encodeUrl(base
						+ "/member/logout.json"));
				$("#loginOut").val(0);
				if (data.isSuccess) {
					$('.events-logged').addClass('none');
					$('.events-login').removeClass('none');
					$("#status").val(0);
					commonloginstatus = false;

                    // 三星api 需要访问才能登出，使用jsonp跨域
                    $.ajax({
                        url:data.returnUrl,
                        dataType:"jsonp",
                        jsonpCallback:"login",
                        success:function (data1) {
                            console.log(data1);
                        }
                    });
                    window.location.href = base + "/index.htm";
				}
			});

	// S助手登录
	var localHref = window.location.href;
	// S助手访问时、加载主页面时（方式用户点击退出没反应）、未登录时走S助手自动登录流程
	if (userAgent.indexOf('SamsungLifeService') != -1 && localHref.substr(localHref.length - 1, 1) == '/' && !isSaLogin) {
	    var sso = new SaSso();
		sso.autoLogin();
		loadNum();
	}
	// 用户唤起s助手 未登录时 弹出登录框
	if (userAgent.indexOf('SamsungLifeService') != -1 && localHref.substring(localHref.length - 27, localHref.length) == 'needSamsungLifeServiceLogin' && !isSaLogin) {
	    var saSso = new SaSso();
		saSso.saLogin();
		// 用于处理 异步登陆需要等待
		if (localHref.indexOf("/myaccount/memberorderlist.htm") > 0) {
			var checkLoginStatus = function() {
				if (commonloginstatus) {
					clearInterval(interval);
					window.location.href = localHref.replace(
							"needSamsungLifeServiceLogin", "");
				}
			}
			var interval = window.setInterval(checkLoginStatus, 500);
		}
	}
	// 下列代码用于修复S助手中，多次登录弹层的问题
	var logginEvent = 'tap';
	if (userAgent.indexOf('SamsungLifeService') != -1) {
		logginEvent = 'touchend';
	}

	$('#login').on(
			logginEvent,
			function() {
				judgeLogin(_w);
			});
	// 绑定页唤起
    $('#samsungLogin,#samsungLoginBind').on(logginEvent,
        function () {
            //如果不是s助手
            if (userAgent.indexOf('SamsungLifeService') == -1) {
                // 手机&paid中普通浏览器点击登录唤起S助手APP
                goToSAssistant(window.location.href);
                if (_w < 1025 && $('.mob-slider-box').is(':visible')) {
                    $('.events-mob-menu').trigger('tap');
                }
                newShopLogin(1);

                //如果是s助手
            } else {
                if (commonloginstatus == false) {
                    var saSso = new SaSso();
                    saSso.saLogin();
                } else {
                    if (window.location.href.indexOf("/member/login.htm") > 0 && userAgent.indexOf('SamsungLifeService') != -1) {
                        window.location.href = base + "/";
                    }
                }
            }
        });

	$('#callback').on("tap", function() {
		AlipayJSBridge.call('closeWebview');
	})

	// 导航中的登录
	superLogin("loginName", "password", "loginCommit", "errorMsgIdLgn",
			"errorMsgIdPwd", "loginForm");
	// user select
	$('.events-scroll-wrap .scroll-gallery-res, .events-scroll-gallery').live(
			'mouseenter', function() {
				$('body').addClass('user-select');
			}).live('mouseleave', function() {
		$('body').removeClass('user-select');
	});

	// 登录成功之后下拉框
	$('.events-top-nav-login').live('mouseenter', function() {
		$('>.sub-menu', this).stop(true, true).fadeIn('fast');
	}).live('mouseleave', function() {
		$('>.sub-menu', this).stop(true, true).fadeOut('fast');
	});
	$("#logOutM").on(
			'tap',
			function() {
				var data = loxia.syncXhr(loxia.encodeUrl(base
						+ "/member/logout.json"));
				if (data.isSuccess) {
					$("#status").val(0);

                    // 三星api 需要访问才能登出，使用jsonp跨域
                    $.ajax({
                        url:data.returnUrl,
                        dataType:"jsonp",
                        jsonpCallback:"login",
                        success:function (data) {
                            console.log(data);
                        }
                    });
                    window.location.href = base + "/index.htm";
				}
			});
	$(window).resize(function() {
		LoginConfirm.refreshPosition();
		registerConfirm.refreshPosition();
		codeConfirm.refreshPosition();
	}).resize();
	/** ********************登录结束******************************* */
	// 解决鼠标双击时页面出现蓝色框的问题
	$('.events-scroll-wrap .scroll-gallery-res, .events-scroll-gallery').live(
			'mouseenter', function() {
				$('body').addClass('user-select');
			}).live('mouseleave', function() {
		$('body').removeClass('user-select');
	});

	// 控制登录延迟备注 显示
	var date = new Date(), time_str = date.getTime().toString(), new_time = time_str
			.substr(0, 10);

	if (new_time >= '1472745300' && new_time <= '1472747700') {
		$('.login-remarks').show();
	}

	//配置顶部侧边栏
	configTopBar()
	// 顶部通栏
	configTopFence()
});

/**
 * 报错信息弹层
 */
function showTip(msg) {
	noticeDialog = $.spice.dialog({
		dialogClass : 'dialog-notice',
		fixed : true,
		title : '<i class="icon icon-wrong"></i>' + msg + '',
		button : [ '确定' ],
		cancel : function() {
			noticeDialog.hide();
		}
	});
	noticeDialog.show();
}

/**
 * 第三方自动登录 TODO update.login2 用户已登录，就不要发起tomcat请求，这个是冗余的。直接判断cookie的会员状态（暂时不改）
 * @returns
 */
function goToLogin(){

	var returnUrl = window.location.href;

	var source = "";
	if(returnUrl.indexOf('/member/login.htm') != -1){
		return;
	}else if(userAgent.indexOf('MicroMessenger') != -1){
		source = 'WECHAT';
	}else if(userAgent.indexOf('AlipayClient') != -1){
		source = 'ALIPAY';
	}else{
		return;
	}

	console.log("returnUrl:"+returnUrl);
	var goToLoginURL = base + '/zeus/member/isGotoThirdPartLogin?callbackUrl=' + encodeURIComponent(returnUrl);
	var jsonData = loxia.syncXhrGet(goToLoginURL,null);
	if(null == jsonData){
		return;
	}
	if('20002508' == jsonData.statusCode && jsonData.data.gotoFlag){
		window.location.href = getThirdPartLoginURL(source);
	}
}


function getThirdPartLoginURL(source){

	var thirdPartLoginUrl =base+ '/zeus/member/getAuthUrl?source='+source+'&operation=base';
	var jsonData = loxia.syncXhrGet(thirdPartLoginUrl,null);
	if(null == jsonData){
		return "/";
	}
	if('20002500' == jsonData.statusCode){
		return jsonData.data.authUrl;
	}else{
		return "/";
	}
}


function logout() {
    var data = loxia.syncXhr(loxia.encodeUrl(base
        + "/member/logout.json"));
    if (data.isSuccess) {
        // 三星api 需要访问才能登出，使用jsonp跨域
        $.ajax({
            url: data.returnUrl,
            dataType: "jsonp",
            jsonpCallback: "login",
            success: function (data1) {
                console.log(data1);
            }
        });
    }
}

function stoAutoLogin() {
	var localHref = window.location.href;
	if (localHref.indexOf("/login/wechatLoading") > 0) {
		return;
	}

	// 判断当前页面是否为首页
	var isIndexPage = validateIsIndexPage();
	var memberName = getMembeNameCookie(memberCookieKey);
	var memberType = getMembeNameCookie(memberTypeCookieKey);
	var memberAccountCHN = getMembeNameCookie(memberAccountCHNCookieKey);

    // 如果这个cookie中设置的是N, 则显示一次非中国用户弹层
    if(!isNullOrEmpty(memberAccountCHN) && memberAccountCHN == 'N'){

        // 非中国用户登录弹层
        noChinaMemberLoginDialog = $.spice.dialog({
            template : $('#dialog-template-nochinamemberlogin').html(),
            fixed : true
        });

        noChinaMemberLoginDialog.show();
        // 登录
        commonloginstatus = false;
        delCookie(memberAccountCHNCookieKey);

        //调用三星登出接口
        logout();
        return;
    }
	// 没有从cookie获取到登录名称(realName)
	if (!isNullOrEmpty(memberType) && !isNullOrEmpty(memberName)) {
		$("#login_name").html(memberName);
		$('.events-logged').removeClass('none');
		$('.events-login').addClass('none');
		$('.events-login-out-m').addClass('block-sm');

		// 显示登录后的购物流程
		$('.event-had-login').show();
		$('.event-not-login').hide();

		// 如果不是PC端登录成功后显示退出
		if ($(window).width() + $.spice.getScrollbarWidth() < 1024) {
			$('.events-login-out-m').removeClass('none');
		}
		$("#loginOut").val(0);
		commonloginstatus = true;
		isSaLogin = true;
		if("true" != memberType){
			// 非三星会员隐藏掉我的积分按钮
			$('#mypoints').addClass('none');
			$('#footer-myPoint').addClass('none');

			// 非会员显示绑定按钮
			$('.event-not-bind-sa').show();
		}else{
			// 非会员隐藏绑定按钮
			$('.event-not-bind-sa').hide();
		}
	}else{
		// 没有登录时
		$('.event-had-login').hide();
		$('.event-not-login').show();
	}

	// s助手登录 绑券
	if (userAgent.indexOf('SamsungLifeService') != -1 && localHref.indexOf("couponCode") != -1 && commonloginstatus) {
		bindCoupon(localHref);
	}
	// 如果是首页那么构建右侧咨询窗上的 优惠券领取信息
	if (isIndexPage) {
		var indexCouponData = getMembeNameCookie(indexCouponDataCookieKey);
		if (!isNullOrEmpty(indexCouponData)) {
			// 后台数据中存有特殊符号（） 那么需要用unescape 来编码
			buildIndexPageViewData($.parseJSON(unescape(indexCouponData)),false);
		}
		if (!buildCouponDataFalg) {
			loadIndexPageViewData();
		}
	}
}

// 空字符
function isBlank(val) {
	if (val == null || $.trim(val) == '') {
		return true;
	}
	return false;
}
/**
 * 发送手机短信
 */
var wait = 90;

get_code_time = function () {
	if (wait == 0) {
		$('.getValidClass').removeClass('active');
		$('.getValidMobileClass').removeClass('active');
		wait = 90;
	} else {
		$('.getValidClass').addClass('active');
		$('.getValidMobileClass').addClass('active');
		$('#timeId').html('(' + wait + 's)');
		$('#timeMobileId').html('(' + wait + 's)');
		wait--;
		setTimeout(function() {
			get_code_time()
		}, 1000)
	}
}

function setLoginName() {
	if (!isNull($.spice.getCookie('loginName_us'))) {
		$("#loginName").val($.spice.getCookie('loginName_us'));
		addCheckBox("loginForm");
		addCheckBox("loginFormPay");
		addCheckBox("loginFormOrder");
		$("#loginNamePay").val($.spice.getCookie('loginName_us'));
		$("#loginNameOrder").val($.spice.getCookie('loginName_us'));
	} else {
		delCheckBox("loginForm");
		delCheckBox("loginFormPay");
		delCheckBox("loginFormOrder");
	}
}
/**
 * 选择记住邮箱或手机checkBox
 *
 * @param loginForm
 */
function addCheckBox(loginForm) {
	$("#" + loginForm).find('.icon-checked').addClass('is-active');
}
/**
 * 清除form
 *
 * @param loginForm
 */
function clearForm(loginForm) {
	$('#' + loginForm)[0].reset();
}
function vaildMobileInput() {
	/** 用户名 */
	$('#mobile').next().find("span").hide();
	$('#mobile').blur(function() {
		if (isNull($(this).val())) {
			addClassMobile('mobile', 'mobileClass');
			$(this).next().find("span").show();
		} else if (!isFormatMobile($(this).val())) {
			if (!isFormatMobile($(this).val())) {
				if (!$('.' + 'mobileClass').hasClass('is-error')) {
					$('.' + 'mobileClass').addClass('is-error');
				}
			} else {
				if ($('.' + 'mobileClass').hasClass('is-error')) {
					$('.' + 'mobileClass').removeClass('is-error');
				}
			}
			$(this).next().find("span").show();
		} else {
			addClassMobile('mobile', 'mobileClass');
			$(this).next().find("span").hide();
		}
	});
	/** 密码 */
	$('#mobileVaild').next().find("span").hide();
	$('#mobileVaild').blur(function() {
		if (isNull($(this).val())) {
			addClassMobile('mobileVaild', 'mobileVaildClass');
			$(this).next().find("span").show();
		} else {
			addClassMobile('mobileVaild', 'mobileVaildClass');
			$(this).next().find("span").hide();
		}
	});
}

function addClassMobile(s, s1) {
	if (isNull($('#' + s).val())) {
		if (!$('.' + s1).hasClass('is-error')) {
			$('.' + s1).addClass('is-error');
		}
	} else {
		if ($('.' + s1).hasClass('is-error')) {
			$('.' + s1).removeClass('is-error');
		}
	}
}

function superLogin(loginName, password, loginCommit, errorMsgIdLgn,
		errorMsgIdPwd, loginForm) {
	var loginName_1 = "#" + loginName;
	/** 用户名 */
	$(loginName_1).next().find("span").hide();
	$(loginName_1).blur(function() {
		if (isNull($(this).val())) {
			$(this).next().find("span").show();
		} else if (!isUserName($(this).val())) {
			$(this).next().find("span").show();
		} else {
			$(this).next().find("span").hide();
		}
	});
	var password_1 = "#" + password;
	/** 密码 */
	$(password_1).next().find("span").hide();
	$(password_1).blur(function() {
		if (isNull($(this).val())) {
			$(this).next().find("span").show();
		} else {
			$(this).next().find("span").hide();
		}
	});
	// 登录添加回车键
	$(loginName_1 + "," + password_1).keydown(
			function(event) {
				if (!event)
					event = window.event;
				if (event.keyCode == 13) {
					// 调用失去焦点验证
					$(loginName_1 + "," + password_1).trigger('blur');
					var bol = false;
					if ($("#" + errorMsgIdLgn).is(":hidden")
							&& $("#" + errorMsgIdPwd).is(":hidden")) {
						bol = true;
					}
					if (!bol)
						return;
					login(loginName, loginForm);
				}
			});
	// 登录
	$("#" + loginCommit).bind(
			'click',
			function() {
				// 调用失去焦点验证
				$(loginName_1 + "," + password_1).trigger('blur');
				var bol = false;
				if ($("#" + errorMsgIdLgn).is(":hidden")
						&& $("#" + errorMsgIdPwd).is(":hidden")) {
					bol = true;
				}
				if (!bol)
					return;
				login(loginName, loginForm);
			});
}
/**
 * 选择记住邮箱或手机checkBox
 *
 * @param loginForm
 */
function checkBox(loginForm) {
	return $("#" + loginForm).find('.icon-checked').hasClass('is-active');
}
/**
 * 选择记住邮箱或手机checkBox
 *
 * @param loginForm
 */
function delCheckBox(loginForm) {
	$("#" + loginForm).find('.icon-checked').removeClass('is-active');
}
/**
 * 登录验证子方法 //
 */
function login(loginName, loginForm) {
	if (loginForm == "loginForm") {
		cookie(loginForm, loginName);
	}
	if (loginForm == "loginFormPay") {
		cookie(loginForm, loginName);
	}
	if (loginForm == "loginFormOrder") {
		cookie(loginForm, loginName);
	}
	$('#' + loginForm).append(
			$('<input />').attr('name', "_csrf").attr('type', 'hidden').val(
					$("meta[name='_csrf']").attr("content")));
	$('#' + loginForm).submit();
}
function cookie(loginForm, loginName) {
	if (checkBox(loginForm)) {
		setCookie('loginName_us', $("#" + loginName).val());
	} else {
		delCookie('loginName_us');
		delCheckBox(loginForm);
	}
}

// 设置cookie
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString() + ";path=/";
	return true;
}
// 设置cookie
function setCookie(name, value, expireSecond) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + expireSecond * 1000);
    document.cookie = name + "=" + escape(value) + ";expires="
        + exp.toGMTString() + ";path=/";
    return true;
}
function getsec(str) {
	var str1 = str.substring(1, str.length) * 1;
	var str2 = str.substring(0, 1);
	if (str2 == "s") {
		return str1 * 1000;
	} else if (str2 == "h") {
		return str1 * 60 * 60 * 1000;
	} else if (str2 == "d") {
		return str1 * 24 * 60 * 60 * 1000;
	}
}
// 删除cookie
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = $.spice.getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
				+ ";path=/";
}
/**
 * 邮箱或手机
 *
 * @param val
 * @returns {Boolean}
 */
function isUserName(val) {
	var a = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	var number = /^\d{4,}$/;
	if (a.test(val.replace(/(^\s*)|(\s*$)/g, '')) || number.test(val))
		return true;
	else
		return false;
}
//
function loadShoppingCart() {
	var url = base + "/shopping/cart/listInfo.json";
	var json = {
		couponCode : "",
		nowBuy : false
	};

	loxia
			.asyncXhrPost(
					url,
					json,
					{
						success : function(jsonData) {
							var cartCommand = eval(jsonData.description);
							if (jsonData.isSuccess) {
								doMiniShoppingCartHtml(cartCommand);
								if (null != cartCommand && "" != cartCommand
										&& !$.isEmptyObject(cartCommand)) {
									cartIsEmpty = true;
									// 迷你购物车删除商品事件
									$('.events-cart-delete')
											.on(
													'tap',
													function() {

														removeMiniShoppingCartData(
																$(this)
																		.attr(
																				"skuId"),
																$(this));

														// 流量跟踪
														var tracingItemCode = $(
																this)
																.siblings()
																.attr("href");
														tracingItemCode = tracingItemCode
																.substring(
																		6,
																		tracingItemCode.length - 4);
														delMiniShoppingCart(tracingItemCode);

													});

									if ($('.events-minicart-res').is(':hidden')) {

										showMinicartTime = setTimeout(
												function() {
													$('.events-minicart-res')
															.stop(true, true)
															.slideDown(
																	'fast',
																	function() {
																		// 迷你购物车滚动条
																		$(
																				'.events-minicart-scrollbar')
																				.removeData(
																						'plugin_tinyscrollbar');
																		$.spice
																				.tinyscrollbar(
																						'.events-minicart-scrollbar',
																						{
																							wheelLock : true,
																							touchLock : false
																						});
																	});
												}, 100);
									} else {
										// lu
										// 定时器timeShopcart 是写在pdp.js里 点击加入购物车的时候
										// 展开mini购物车后让起消失用的
										timeShopcart = setTimeout(function() {
											$('.events-minicart').trigger(
													$.spice.mouseleave);
										}, 2000);
										timeShopcart
												&& clearTimeout(timeShopcart);
									}

								} else {
									miniCount = 0;
									cartIsEmpty = false;
									$('.events-minicart-res').stop(true, true)
											.slideUp();

								}
								// 大购物车mini购物车同时开着，删除迷你刷新大购物车
								if (isNotNullOrEmpty($("#bigCart").val())) {
									refreshShoppingCartData(cartCommand);
								}

							} else {
								if (null == cartCommand || "" == cartCommand
										|| !$.isEmptyObject(cartCommand)) {

									$("#miniQuantity").attr('value', 0);
									cartNumUseForNewIndex = '0'
									$("#miniCartSubMon").html('&#165;' + 0);
									// $("#miniCartHtml").html("");
								}
							}

						}
					}, {
						error : function(jsonData) {
							console.log(jsonData);
						}
					});

}

// 刷新大购物车数据
function refreshShoppingCartData(cartCommand) {
	inHtml = "";
	if (cartCommand != null) {
		inHtml = "";
		$.each(cartCommand.shoppingCartLineCommands, function(index, obj) {
			if (obj.gift == false && obj.captionLine == false) {

				inHtml += dolistInfoPage(obj);
			}
		});
		$(".shopcart-list-content").html(inHtml);
		// 总计
		$(".shopcost-sum-num").html(
				"&#165;" + fMoney(cartCommand.originPayAmount, 2));
		bindEvents();
		chooseAllCheck();

	} else {
		window.location.href = "/shopping/cart.htm";
	}
}

function doMiniShoppingCartHtml(shoppingCartCommand) {

	var miniCartHtml = "";
	var totalNum = 0;
	var miniCartSubMon = 0;
	var giftValue = '<i class="sam-tips">赠品</i>';
	extCodes = "";
	if (null != shoppingCartCommand && "" != shoppingCartCommand
			&& !$.isEmptyObject(shoppingCartCommand)) {

		// miniCartSubMon = toDecimal2(shoppingCartCommand.originPayAmount);

		$.each(shoppingCartCommand.shoppingCartLineCommands, function(index,
				obj) {

			if (obj.stock > 0 && (obj.stock - obj.quantity >= 0) && !obj.gift) {
				extCodes += "," + obj.extentionCode;
			}

			// console.log("---1:" + obj.gift);

			if (obj.gift == false && obj.captionLine == false) {
				var proValue = "";
				var clasHtml = "";
				var tishiHtml = "";

				totalNum += obj.quantity;
				miniCartSubMon = toDecimal2(obj.salePrice * obj.quantity
						+ parseFloat(miniCartSubMon));
				if (obj.skuPropertys != null
						&& !$.isEmptyObject(obj.skuPropertys)) {
					$.each(obj.skuPropertys, function(index, obj) {
						proValue += obj.value + " ";
					});
				}
				// 是赠品就将属性值位置置换为赠品
				if (obj.gift) {
					proValue = giftValue;
				}

				if (obj.stock == 0) {
					tishiHtml = '<p>暂时缺货！</p>';
					clasHtml = "minicart-list-stockout";
				}
				;
				if (obj.stock - obj.quantity < 0) {
					tishiHtml = '<p>库存不足！</p>';
					clasHtml = "minicart-list-stockout";
				}
				;

				miniCartHtml += '<li class="float-clearfix ' + clasHtml + '">'
						+ '<div class="minicart-list-left">'
						+ '<a href="/item/' + obj.productCode + '.htm">'
						+ '<img src="' + imgbase + obj.itemPic + '" alt="" >	'
						+ '</a>' + '</div>'
						+ '<div class="minicart-list-right">'
						+ '<a href="/item/' + obj.productCode
						+ '.htm" class="minicart-list-title">' + obj.itemName
						+ '</a><p>' + proValue + '</p>'
						+ '<p>数量<span class="cart-qty">' + obj.quantity
						+ '</span></p>'
						+ '<p>金额<span class="cart-singleprice">&#165;'
						+ fMoney(obj.salePrice, 2) + '</span></p>' + tishiHtml
						+ '<a class="cart-delete events-cart-delete" skuId="'
						+ obj.skuId
						+ '"><i class="icon icon-cart-delete"></i></a>'
				'</div>' + '</li>';
			}
		});

	}
	$("#miniCartSubMon").html('&#165;' + fMoney(miniCartSubMon, 2));
	if (totalNum > 0) {
		$('.events-cart').removeClass('is-empty');
	}
	if (totalNum > 9) {
		$("#miniQuantity").addClass("shopcart-two-num");
	} else {
		$("#miniQuantity").removeClass("shopcart-two-num");
	}
	$("#miniQuantity").attr('value', totalNum);
	cartNumUseForNewIndex = totalNum
	$("#miniCartHtml").html(miniCartHtml);

}

// 删除mini购物车行
function removeMiniShoppingCartData(skuId, obj) {
	var json = {
		skuId : skuId
	};

	loxia
			.asyncXhrPost(
					base + "/shopping/cart/delete.json",
					json,
					{
						success : function(jsonData) {
							console.log(JSON.stringify(jsonData));
							if (null != jsonData && "" != jsonData
									&& !$.isEmptyObject(jsonData)) {
								if (jsonData.isSuccess == true) {
									console.log("删除成功！");

									obj.parents('li.float-clearfix').remove();
									$('.events-minicart-scrollbar').removeData(
											'plugin_tinyscrollbar');
									$.spice.tinyscrollbar(
											'.events-minicart-scrollbar', {
												wheelLock : false,
												touchLock : false
											});
									var $tinyBar_Disable = $('.events-minicart-res .scrollbar.disable');
									var $tinyBar_Overview = $tinyBar_Disable
											.siblings('.viewport').find(
													'.overview');
									if ($tinyBar_Disable) {
										$tinyBar_Overview.addClass('active');
									} else {
										$tinyBar_Overview.removeClass('active');
									}
									// reload
									loadShoppingCart();

								} else {
									console.log("删除失败！");
								}

							} else {
								console.log("删除失败！");
								console
										.warn("[%o] jsonData is null or empty,nothing to do!!!");
							}
						}
					}, {
						error : function(jsonData) {
							console.log("删除失败！");
							console.log(jsonData);
						}
					});

}

// 更新minicart选择操作
function shoppingMiniCartSelect() {

	if (extCodes.length > 0) {
		var json = {
			extentionCodes : extCodes.substring(1),
			isSelected : 'true'
		};

		loxia.asyncXhrPost(base + "/shopping/cart/select.json", json, {
			success : function(jsonData) {
				if (jsonData.isSuccess) {
					toMiniPay();
					console.log("修改成功！");
				} else {

				}

			}
		}, {
			error : function(jsonData) {
				console.log("修改失败！");
			}
		});

	}

}

function toMiniPay() {

	var cartTotal = 0;
	var validTotal = 0;
	$.each($(".mini-cart-list").find("li"), function(index, obj) {
		cartTotal++;
		if ($(obj).hasClass("minicart-list-stockout")) {
			validTotal++;
		}
	});
	// 总商品数为0，或者 总商品数不为0 且 总商品数 == 无效商品数
	if (cartTotal == 0 || (cartTotal != 0 && (cartTotal == validTotal))) {
		return;
	}
	// 验证当前购物车中所选中的 商品是否满足免息条件
	var result = vilidateItemIsInterestFree();
	if (!result) {
		interestFreeDialog.show();
		return;
	}

	window.location.href = base + "/order/checkOut.htm";
}

// 验证当前购物车中所选中的 商品是否满足免息条件
function vilidateItemIsInterestFree() {

	var url = base + "/shopping/vilidateItemIsInterestFree.json";
	var data = loxia.syncXhrPost(url, null);
	// 不满足免息条件 弹出弹层
	if (!data) {
		return false;
	}
	return true;
}

// 滑到对应的报错栏
function errorScroll(idclass) {
	var offsetT = $(idclass).offset().top;
	$('html,body').animate({
		scrollTop : offsetT
	}, 500);
}

function loadNum() {
	//aes加密后前端拿到会多加双引号
	var jsonData = getCookie('g_c_s_cnt');
	//aes解密
	jsonData=aesDecode(jsonData.substring(1,jsonData.length-1));
	// 如果为空就赋值为0
	jsonData = isNotNullOrEmptyNum(jsonData);
	if (jsonData == 0) {
		// 如果为空，移除value。
		$('.events-cart > a').removeAttr('value');
		$('.events-cart').addClass('is-empty');
		return;
	}
	$('.events-cart').removeClass('is-empty');
	$("#miniQuantity").attr('value', jsonData);
	cartNumUseForNewIndex = jsonData
}

$("#footer-myOrder").live('click', function () {

    if (commonloginstatus) {
        window.location.href = base + "/myaccount/memberorderlist.htm";
        return;
    }

    if (userAgent.indexOf('SamsungLifeService') != -1) {
        var sso = new SaSso();
        sso.saLogin();
        //用于处理 异步登陆需要等待
        var checkLoginStatus = function () {
            if (commonloginstatus) {
                loadNum();
                window.location.href = base + "/myaccount/memberorderlist.htm";
                clearInterval(interval);
            }
        }
        var interval = window.setInterval(checkLoginStatus, 500);
    } else {
        goToSAssistant(document.location.protocol + "//" + window.location.host + "/order/gotoSAssistantImmediatelyBuyRedirectPage.htm?returnUrl=/myaccount/memberorderlist.htm?fromBrowser=true");
        newShopLogin(2);
    }
});

$("#footer-coupons").live('click', function () {

					if (commonloginstatus) {
						window.location.href = base
								+ "/member/coupons/couponsInfo.htm";
						return;
					}
					if (userAgent.indexOf('SamsungLifeService') != -1) {
						var sso = new SaSso();
						sso.saLogin();
						// 用于处理 异步登陆需要等待
						var checkLoginStatus = function() {
							if (commonloginstatus) {
								loadNum();
								window.location.href = base
										+ "/member/coupons/couponsInfo.htm";
								clearInterval(interval);
							}
						}
						var interval = window
								.setInterval(checkLoginStatus, 500);
					} else {
						goToSAssistant(document.location.protocol
								+ "//"
								+ window.location.host
								+ "/order/gotoSAssistantImmediatelyBuyRedirectPage.htm?returnUrl=/member/coupons/couponsInfo.htm?fromBrowser=true");
						newShopLogin(2);
					}
				});
$("#footer-myinfo")
		.live(
				'click',
				function() {

					if (commonloginstatus) {
						window.location.href = base
								+ "/myaccount/myaccount-info.htm";
						return;
					}

					if (userAgent.indexOf('SamsungLifeService') != -1) {
						var sso = new SaSso();
						sso.saLogin();
						// 用于处理 异步登陆需要等待
						var checkLoginStatus = function() {
							if (commonloginstatus) {
								loadNum();
								window.location.href = base
										+ "/myaccount/myaccount-info.htm";
								clearInterval(interval);
							}
						}
						var interval = window
								.setInterval(checkLoginStatus, 500);
					} else {
						goToSAssistant(document.location.protocol
								+ "//"
								+ window.location.host
								+ "/order/gotoSAssistantImmediatelyBuyRedirectPage.htm?returnUrl=/myaccount/myaccount-info.htm?fromBrowser=true");
						newShopLogin(2);
					}
				});
$("#footer-myaddress").live('click',function() {

					if (commonloginstatus) {
						window.location.href = base
								+ "/myaccount/myaccount-address.htm";
						return;
					}

					if (userAgent.indexOf('SamsungLifeService') != -1) {
						var sso = new SaSso();
						sso.saLogin();
						// 用于处理 异步登陆需要等待
						var checkLoginStatus = function() {
							if (commonloginstatus) {
								loadNum();
								window.location.href = base
										+ "/myaccount/myaccount-address.htm";
								clearInterval(interval);
							}
						}
						var interval = window
								.setInterval(checkLoginStatus, 500);
					} else {
						goToSAssistant(document.location.protocol
								+ "//"
								+ window.location.host
								+ "/order/gotoSAssistantImmediatelyBuyRedirectPage.htm?returnUrl=/myaccount/myaccount-address.htm?fromBrowser=true");
						newShopLogin(2);
					}
				});

$("#footer-myaccount-grade").live('click',function() {

					if (commonloginstatus) {
						window.location.href = base
								+ "/myaccount/myaccount-grade.htm";
						return;
					}

					if (userAgent.indexOf('SamsungLifeService') != -1) {
						var sso = new SaSso();
						sso.saLogin();
						// 用于处理 异步登陆需要等待
						var checkLoginStatus = function() {
							if (commonloginstatus) {
								loadNum();
								window.location.href = base
										+ "/myaccount/myaccount-grade.htm";
								clearInterval(interval);
							}
						}
						var interval = window
								.setInterval(checkLoginStatus, 500);
					} else {
						goToSAssistant(document.location.protocol
								+ "//"
								+ window.location.host
								+ "/order/gotoSAssistantImmediatelyBuyRedirectPage.htm?returnUrl=/myaccount/myaccount-grade.htm?fromBrowser=true");
						newShopLogin(2);
					}
				});

$("#footer-myPoint").live('click',function() {

					if (commonloginstatus) {
						window.location.href = base + "/member/points/list.htm";
						return;
					}

					if (userAgent.indexOf('SamsungLifeService') != -1) {
						var sso = new SaSso();
						sso.saLogin();
						// 用于处理 异步登陆需要等待
						var checkLoginStatus = function() {
							if (commonloginstatus) {
								loadNum();
								window.location.href = base
										+ "/member/points/list.htm";
								clearInterval(interval);
							}
						}
						var interval = window
								.setInterval(checkLoginStatus, 500);
					} else {
						goToSAssistant(document.location.protocol
								+ "//"
								+ window.location.host
								+ "/order/gotoSAssistantImmediatelyBuyRedirectPage.htm?returnUrl=/member/points/list.htm?fromBrowser=true");
						newShopLogin(2);
					}
				});

/* 2016714 奥运banner */
imageResize = function(attr) {
	var w = $(window).width();
	$
			.each(
					$('img[' + attr + ']'),
					function(i, elem) {
						var $img = $(elem), data = $.parseJSON($img.attr(attr)), pc = data.pc, ipad = data.ipad, mobile = data.mobile, src = pc;

						if (w <= 1024) {
							src = ipad || pc;
						}
						if (w < 768) {
							src = mobile || pc;
						}

						if ($img.attr('src') != src) {
							$img.attr('src', src);
						}
					});
}
$(window).on('resize.olympic', function() {

	if ($('.c-1').length < 0 && $('.events-banner').length < 0) {
		imageResize('data-image-src');
	}

}).trigger('resize.olympic');

function tinyscrollbarClick() {
	// 修复IOS设备下拉框点击无效
	if ($.spice.iPad || $.spice.iPhone) {
		$('.tinyscrollbar.sub-menu ul li').on(
				'tap',
				function(e) {
					e.preventDefault();
					var _this = $(this), _this_f = _this
							.parents('.events-select'), _this_val = $('span',
							_this).text();

					_this_f.removeClass('is-open');

					$('.sub-menu', _this_f).removeAttr('style');

					// 赋值
					$('.btn span:eq(0)', _this_f).html(_this_val);

				});
	}
}

$('.my-events-addToCart').live('click', function() {
	var skuid = $(this).attr("myskuid");
	var url = base + "/shopping/cart/add.json";
	var data = loxia.syncXhrPost(url, {
		"skuId" : skuid,
		"quantity" : 1
	});
	// mobile弹出层
	if ($(window).width() + 20 < 768) {
		if (data.isSuccess) {
			window.location.href = '/shoppingcart/sucess.htm';
			return false;
		} else if (data.errorCode == 19000) {// 会员专享商品需要登录
			goToSAssistant(window.location.href);
			newShopLogin(2);
		} else if (data.errorCode == 19006) {
			$.spice.tips({
				dialogClass : 'dialog-addCart',
				title : '可购买数量不足，无法继续加入购物车，请重新选择',
				time : 1500
			});
		} else if (data.errorCode == 19007) {
			$.spice.tips({
				dialogClass : 'dialog-addCart',
				title : '超过购买限额,无法继续加入购物车',
				time : 1500
			});
		} else {
			$.spice.tips({
				dialogClass : 'dialog-addCart',
				title : '商品库存不足，暂时无法购买！',
				time : 1500
			});
		}
	} else {
		if (data.isSuccess) {
			window.location.href = '/shoppingcart/sucess.htm';
			return false;
			// cartIsEmpty = true;
			// 刷新当前页面
			// location.reload();
		} else if (data.errorCode == 19000) {// 会员专享商品需要登录
			goToSAssistant(window.location.href);
			newShopLogin(2);
		} else if (data.errorCode == 19006) {
			$.spice.tips({
				dialogClass : 'dialog-addCart',
				title : '<i class="icon-success"></i>可购买数量不足，无法继续加入购物车，请重新选择',
				time : 1500
			});
		} else if (data.errorCode == 19007) {
			$.spice.tips({
				dialogClass : 'dialog-addCart',
				title : '<i class="icon-success"></i>超过购买限额,无法继续加入购物车',
				time : 1500
			});
		} else {
			$.spice.tips({
				dialogClass : 'dialog-addCart',
				title : '<i class="icon-success"></i>商品库存不足，暂时无法购买！',
				time : 1500
			});
		}
	}
});

/**
 * 获取cookie中的值
 *
 * @param c_name
 * @returns
 */
function getMembeNameCookie(c_name) {
	// //解码
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return decodeURI(document.cookie.substring(c_start, c_end));
		}
	}
	return "";

}

/**
 * 判断是否是空字符串 or 无效的字符串
 *
 * @param val
 * @returns
 */
function isNullOrEmpty(val) {
		return val == null
				|| $.trim(val) == ''
				|| val == "null"
				|| val == undefined;
}

/*******************************************************************************
 * 请求后台取到url
 *
 * @returns
 */
/*
 * function RecoveryUrlRedirect(){ var data =
 * loxia.syncXhrPost("/item/buildRecoveryUrl.htm", { "itemId"
 * :$("#itemId").val(), "isPdpPage":"false", }); window.location.href=data; }
 */
/*******************************************************************************
 * pdp页面请求后台取到url
 *
 * @returns
 */
function RecoveryUrlRedirectPdp() {
	if (isSaLogin) {
		sendClickCode('finding_method', 'shop event_' + itemCode + '|'
				+ itemCode + '|'
				+ extentionCodeMap[$('#addCart').attr('extentioncode')]);
		window.location.href = "/item/buildRecoveryUrl.htm?isPdpPage=true";
	} else {
		$("#login").trigger("click");
	}

}

/**
 * 进入首页，重新load IndexPageViewCommand数据
 */
function loadIndexPageViewData() {
	loxia.asyncXhrPost(loxia.encodeUrl(findIndexPageViewCommandUrl), null, {
		success : function(data) {
			buildIndexPageViewData(data.storePromotionCouponCodeCommandMap,true);
		}
	}, {
		error : function(data) {
			console.log(data);
		}
	});
}

// 格式化日期
function formatCouponDate(val) {
	if (val == null || val == '') {
		return "&nbsp;";
	} else {
		return new Date(val).Format("yyyy.MM.dd HH:mm");
	}
}

// 格式化数字(最多保留一位小数)
function formatNum(val) {
	if (val == null || val == '') {
		return "&nbsp;";
	}
	val = val + "";
	var arr = val.split(".");
	if (arr.length > 1) {
		val = arr[0] + '.' + (arr[1].length > 1 ? arr[1].substr(0, 1) : arr[1]);
	}
	return val;
}

/**
 * 新的商城登录--用户名密码在第三方页面
 *
 * @param loginType
 *            登录类型 <br>
 *            1.普通登录<br>
 *            2.订单查询<br>
 *            3.订单支付<br>
 */
function newShopLogin(loginType) {
	var  url = null;
	//S助手不跳转登录页面
	if(userAgent.indexOf('SamsungLifeService')!=-1){
		return;
	}

	if(loginType==2){
		$('#loginFormNew').attr("action", "/member/login.htm?returnUrl=" +encodeURIComponent(window.location.pathname+window.location.search));
		url = "/member/login.htm?fromBrowser=true" + "&returnUrl="  +encodeURIComponent(window.location.pathname+window.location.search);
	}else{
		$('#loginFormNew').attr("action", "/member/1/login.htm");
	}

	var w = $(window).width();
	if (!(userAgent.indexOf("iPhone") > -1 && userAgent.indexOf("Safari") > -1)) {
		timer = setTimeout(function() {
			if(url == null){
				$('#loginFormNew').submit();
			}else{
				window.location.href=url;
			}
		}, 1000);
		return;
	}
	$('#loginFormNew').submit();
}

/**
 * 普通浏览器唤起S助手APP
 *
 * @param goToSAssistant
 */
function goToSAssistant(hrefUrl) {

	// 苹果Safari浏览器 返回
	if (userAgent.indexOf("iPhone") > -1 && userAgent.indexOf("Safari") > -1) {
		return;
	}
	if (userAgent.indexOf('SamsungLifeService') != -1) {
		return;
	}
	if (userAgent.indexOf('Windows') != -1) {
		return;
	}
	if (userAgent.indexOf('Mac OS X') != -1) {
		return;
	}
	var iframe = document.createElement('iframe');
	var body = document.body;
	iframe.style.cssText = 'display:none;width=0;height=0';
	var navigatorAgent = navigator.userAgent;
	var isUCBrowser = navigatorAgent.match(/UC/ig), isQQBrowser = navigatorAgent
			.match(/QQ/ig), is360Browser = navigatorAgent.match(/360/ig);

	if (hrefUrl.indexOf("?") == -1) {
		hrefUrl = hrefUrl + "?1=1";
	}

	hrefUrl = this.handleCid(hrefUrl);

	hrefUrl = hrefUrl+"&fromBrowser=true" + "&needSamsungLifeServiceLogin";

	var urlopen = "sassistant:///#Intent;action=android.intent.action.VIEW;component=com.samsung.android.app.sreminder/.phone.lifeservice.LifeServiceActivity;S.uri="
			+ hrefUrl
			+ ";S.id=seb;S.extra_title_string=中国三星电子 三星网上商城;S.cpname=samsungshop;S.sebServiceId=samsungshop;end";
	;
	var redirectUrl = 'samsungapps://ProductDetail/com.samsung.android.app.sreminder';
	urlopen = urlopen.replace("&amp;", "&");
	if (isUCBrowser || isQQBrowser || is360Browser) {
		body.appendChild(iframe);
		iframe.src = urlopen;
		timer = setTimeout(function() {
			iframe.src = redirectUrl;
		}, 1500);
	} else {
        window.location.href = urlopen;
        timer = setTimeout(function() {
            window.location.href = redirectUrl;
        }, 1500);
	}
}

// 报错提示弹出层
var warnDialog = $.spice.dialog();

function showTips(msg) {
	warnDialog = $.spice.dialog({
		type : 'confirm',
		dialogClass : 'dialog-confirm',
		fixed : true,
		title : '温馨提示',
		content : msg,
		button : [ '确定', '取消' ],
		submit : function() {
			// noticeDialog.hide();
			// window.location.href="/member/removeAlipayBinding.htm?needValidateBindState=true";
			var data = loxia.syncXhrGet("/member/rebind.json", {});
			if (data.isSuccess) {
				// var timestamp =Date.parse(new Date());
				// window.location.href="https://www.samsungshop.com.cn/?v="+timestamp;
				var localHref = window.location.href;
				if (localHref.substr(localHref.length - 1, 1) == '/') {
					var timestamp = Date.parse(new Date());
					window.location.href = localHref + "?v=" + timestamp;
				} else {
					window.location.href = window.location.href;
				}
			}
		},
		cancel : function() {
			warnDialog.hide();
		}
	});
	warnDialog.show();
}

function buildIndexPageViewData(storePromotionCouponCodeCommandMap,fromDb) {
	var beginIndex = 1;
	// 为空不显示
	if (isNullOrEmpty(storePromotionCouponCodeCommandMap)) {
		return;
	}

	var htmlcode = "<div class='right-small'><img src=" + staticbase
			+ "/images/index/add/youhui-fixed.png?20180517112751 alt=''></div>"
			+ "<div class='left-big'><img src=" + staticbase
			+ "/images/index/add/youhui-nav.png?20180517112751 alt=''>"
			+ "<span class='chat-close'><img src=" + staticbase
			+ "/images/index/add/chat-close.png?20180517112751/></span>";
	// 遍历
	for ( var key in storePromotionCouponCodeCommandMap) {
		// 没有配置商品code不显示优惠券领取
		if (key == "null" || key == null || key == undefined || key == "") {
			continue;
		}

		var supportTourists = storePromotionCouponCodeCommandMap[key].supportTourists;
		var couponType = storePromotionCouponCodeCommandMap[key].couponType;
		var discount = storePromotionCouponCodeCommandMap[key].discount;
		var startTime = "";
		var endTime ="";
		if(fromDb){ //DB中出来的时间为时间戳 可直接转成 Date对象
			 startTime = new Date(storePromotionCouponCodeCommandMap[key].startTime);
			 endTime = new Date(storePromotionCouponCodeCommandMap[key].endTime);
		}else{	//而从Cookie 中取出来的时间为特殊String 需要处理后转date对象
			startTime = new Date(
					storePromotionCouponCodeCommandMap[key].startTime.replace('+',
					' ').replace('+', ' ').replace('+', ' ').replace('+',
					' '));
			endTime = new Date(storePromotionCouponCodeCommandMap[key].endTime
					.replace('+', ' ').replace('+', ' ').replace('+', ' ').replace(
							'+', ' '));
		}
		var couponName = storePromotionCouponCodeCommandMap[key].couponName;
		var itemCodes = storePromotionCouponCodeCommandMap[key].itemCodes;
		var useUrl = storePromotionCouponCodeCommandMap[key].useUrl;

		// 优惠券显示个数 索引 最多显示2个优惠券
		if (beginIndex > 2) {
			// 用于判断是否显示“查看更多”样式
			beginIndex += 1;
			break;
		}
		// 支持游客显示优惠券
		if (!commonloginstatus && supportTourists) {
			htmlcode += "<div class='quan-nav"
					+ beginIndex
					+ " nav-commen'><div class='nav-top1'><div class='money-1'>";
			if (couponType == 1) {
				htmlcode += "<p><span>￥</span>" + discount + "</p></div>";
			} else if (couponType == 2) {
				htmlcode += "<p class='zhekou'><span>"
						+ formatNum(discount / 10) + "</span>折</p></div>";
			}

			htmlcode += "<div class='time1'><p>&nbsp;活动时间：<br />&nbsp;"
					+ formatCouponDate(startTime)
					+ "<br />-"
					+ formatCouponDate(endTime)
					+ "</p></div></div><div class='nav-top2'>"
					+ "<p>"
					+ couponName
					+ "</p></div><div class='nav-top3'><p class='immediatelyReceive' itemCode='"
					+ itemCodes
					+ "'><a class='pickUp' style='color: #00c3b2;'  href='javascript:;'>立即领取</a><a class='use none' style='color: #00c3b2;'"
					+ "  href='" + useUrl
					+ "' target='blank'>立即使用</a></p></div></div>";
			beginIndex += 1;
		} else if (commonloginstatus) {
			htmlcode += "<div class='quan-nav"
					+ beginIndex
					+ " nav-commen'><div class='nav-top1'><div class='money-1'>";
			if (couponType == 1) {
				htmlcode += "<p><span>￥</span>" + discount + "</p></div>";
			} else if (couponType == 2) {
				htmlcode += "<p class='zhekou'><span>"
						+ formatNum(discount / 10) + "</span>折</p></div>";
			}

			htmlcode += "<div class='time1'><p>&nbsp;活动时间：<br />&nbsp;"
					+ formatCouponDate(startTime)
					+ "<br />-"
					+ formatCouponDate(endTime)
					+ "</p></div></div><div class='nav-top2'>"
					+ "<p>"
					+ couponName
					+ "</p></div><div class='nav-top3'><p class='immediatelyReceive' itemCode='"
					+ itemCodes
					+ "'><a class='pickUp' style='color: #00c3b2;'  href='javascript:;'>立即领取</a><a class='use none' style='color: #00c3b2;'"
					+ "  href='" + useUrl
					+ "' target='blank'>立即使用</a></p></div></div>";
			beginIndex += 1;
		}
	}

	if (1 == beginIndex) {
		htmlcode += "<input value='hide' type='hidden' id='needHidecouponBox'/></div>";
		$(".coupon").addClass('none');
	} else if (3 < beginIndex) {
		htmlcode += "<div class='chat-bottom3 chat-com'><a class='showMore'>查看更多</a></div></div>";
		$(".coupon").removeClass('none');
	}

	$(".coupon").append(htmlcode);
	buildCouponDataFalg = true;
};

function validateIsIndexPage() {
	var currentUrl = window.location.href;
	var urlLastStr = currentUrl.substr(currentUrl.length - 1, 1);
	// 首页会员登录成功，加载最新首页数据(去除首页cdn缓存)
	if (urlLastStr == "/" || urlLastStr == ""
			|| currentUrl.indexOf("index.htm") != -1) {
		return true;
	}
	return false;
}

/** 处理cid * */
function handleCid(hrefUrl) {
	// 调用方法获取地址栏中cid
	var requestParamList = getRequestParam();
	var cid = requestParamList['cid'];
	// cid 不为空那么 存COOKIE 1小时
	if (cid != null || cid != undefined) {
		cookie.set(cidCookieKey, cid, 1);
	}
	// 现连接 cid 为空 那么读 cookie中的cid
	if (cid == null || cid == undefined) {
		cid = cookie.get(cidCookieKey);
	}
	//
	if (hrefUrl.indexOf('cid=') == -1 && (cid != null || cid != undefined)) {
		hrefUrl = hrefUrl + "&cid=" + cid;
	}
	return hrefUrl;
}

function bindCoupon(url) {
	var couponCode=getRequestParam().couponCode;
	var json = {
		"couponCode" : couponCode
	};
		var data = loxia.syncXhrPost("/member/bindingCoupon.json", json);
		if (data.isSuccess && data.description === "200") {
				showTip("优惠券绑定成功");
				return;
		}
			var bindResultString = data.description;
			if (bindResultString === "2001") {
				errorMsg = "优惠券不存在";
			} else if (bindResultString === "2002") {
				errorMsg = "优惠券已使用";
			} else if (bindResultString === "2003") {
				errorMsg = "优惠券已绑定";
			} else if (bindResultString === "2004") {
				errorMsg = "优惠券不是该活动的";
			} else if (bindResultString === "2005") {
				errorMsg = "您的优惠券已成功绑定";
			} else if (bindResultString === "2006") {
				errorMsg = "您已参加过该活动";
			} else {
				errorMsg = "优惠券绑定失败";
			}
				showTip(errorMsg);
	}


/** *获取地址栏信息 */
function getRequestParam() {
	var url = location.search; // 获取url中"?"符后的字串
	var theRequestParam = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequestParam[strs[i].split("=")[0]] = unescape(strs[i]
					.split("=")[1]);
		}
	}
	return theRequestParam;
}
/** 操作COOKIE */
var cookie = {
	set : function(key, val, time) {// 设置cookie方法
		var date = new Date(); // 获取当前时间
		var expiresDays = time; // 将date设置为nH以后的时间
		date.setTime(date.getTime() + expiresDays * 3600 * 1000); // 格式化为cookie识别的时间
		document.cookie = key + "=" + val + ";expires=" + date.toGMTString(); // 设置cookie
	},
	get : function(key) {// 获取cookie方法
		/* 获取cookie参数 */
		var getCookie = document.cookie.replace(/[ ]/g, ""); // 获取cookie，并且将获得的cookie格式化，去掉空格字符
		var arrCookie = getCookie.split(";"); // 将获得的cookie以"分号"为标识
												// 将cookie保存到arrCookie的数组中
		var tips; // 声明变量tips
		for (var i = 0; i < arrCookie.length; i++) { // 使用for循环查找cookie中的tips变量
			var arr = arrCookie[i].split("="); // 将单条cookie用"等号"为标识，将单条cookie保存为arr数组
			if (key == arr[0]) { // 匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
				tips = arr[1]; // 将cookie的值赋给变量tips
				break; // 终止for循环遍历
			}
		}
		return tips;
	},
	del : function(key) { // 删除cookie方法
		var date = new Date(); // 获取当前时间
		date.setTime(date.getTime() - 10000); // 将date设置为过去的时间
		document.cookie = key + "=v; expires =" + date.toGMTString();// 设置cookie
	}
};

/** *获取地址栏信息 */
function getRequestParam() {
	var url = location.search; // 获取url中"?"符后的字串
	var theRequestParam = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequestParam[strs[i].split("=")[0]] = unescape(strs[i]
					.split("=")[1]);
		}
	}
	return theRequestParam;
}

/**
 * 判断登陆方式
 * @param type
 * @returns
 */
function judgeLogin(_w){
	if (userAgent.indexOf('SamsungLifeService') == -1) {
		// 手机&paid中普通浏览器点击登录唤起S助手APP
		goToSAssistant(window.location.href);
			if (_w < 1025 && $('.mob-slider-box').is(':visible')) {
				$('.events-mob-menu').trigger('tap');
			}
			newShopLogin(2);
	} else {
		var saSso = new SaSso();
		saSso.saLogin();
	}
}

// 顶部侧边栏可配置
function configTopBar() {
	var url = base + '/plugin/getCmsJson/topLabel'
	var topBarHtml = $('#topBar').html()
	var navBarHtml = $('#navBar').html()

	var barData = loxia.syncXhrGet(url, {});
	if (barData.data) {
		barData = barData.data
		var barlist = barData.label_list.sort(compare)
		barData = {label_list: barlist}

		if (topBarHtml && navBarHtml)  {
            var topBaresult = Mustache.render(topBarHtml.trim(), barData);
            var navBaresult = Mustache.render(navBarHtml.trim(), barData);

			$('.top-nav-right.float-right.back-offical-home').find("a").remove()
			$('.top-nav-right.float-right.back-offical-home').prepend(topBaresult)
			$('#floatRight').append(navBaresult)
        }
	}
}

function configTopFence() {
	var topFenceHtml = $('#topFenceTemplate').html()
	var url = base + '/plugin/getCmsJson/topFenceData'
	var isMobile = $(window).width() < 1024;

	var baseData = loxia.syncXhrGet(url, {});
	var baseData = baseData.data;
	if (topFenceHtml && baseData && !isMobile)  {
		var topFenceesult = Mustache.render(topFenceHtml.trim(), baseData);
		$('#topFenceContent').append(topFenceesult)

		// 定时关闭
		setTimeout(function () {
			$('#topFenceContent').hide()
		},baseData.time * 1000)
	}
}

function closeTopFence() {
	$('#topFenceContent').hide()
}

function compare(a, b) {
	return a.label_sort - b.label_sort;
}

(function () {
    var src = '//cdn.jsdelivr.net/npm/eruda';
    if (!/eruda=true/.test(window.location)) return;
    document.write('<script src="' + src + '"></script>');
    document.write('<script>eruda.init();</script>');
})();