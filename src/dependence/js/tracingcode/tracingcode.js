
//这里为代码追踪
//追踪方式为主动触发   
//调用第三方插件
//所有的追踪代码都在这里统一集中
//2016-04-18  Arvin.Chang & yuelou.Zhang
//很多页面需要传参数 modelName 但是又不允许传中文，这种地方一律传商品code 即 itemCode！！！

/*** 判断是否第一次进入pdp页(刷新pdp页) **/
var firstInPDP = true;

/*** 判断是否是点击“立即购买”/“立刻秒杀”弹出的登录框 **/
var loginFromBtnqs = false;

/** 查询sku信息URL*/
var FIND_SKU_EXTENTIONCODE_BY_ITEMCODE_URL = "/shopping/findSkuextentionCodeByItemCode.json";

/** 查询sku信息URL*/
var FIND_SKU_EXTENTIONCODE_BY_SKUID_URL = "/shopping/findSkuextentionCodeByskuId.json";

$(function(){

	// 循环选择头部导航元素 1-1~~~1-5
    $(".events-navbar-menu  .nav-pills>li>a").on('tap',function(){
        var code= $(this).attr('href');
		if (code == '/phone') {                    // 智能手机
            sendClickCode('gnb', "shop_phone");
		} else if (code == '/wearables') {         // 可穿戴设备
            sendClickCode('gnb', "shop_wearables");
		} else if (code == '/airpurifier') {       // 空气净化器
            sendClickCode('gnb', "shop_airpurifier");
		} else if (code == '/accessories') {       // 配件
            sendClickCode('gnb', "shop_accessories");
		}
	})


	
	// 头部搜索 1-6
	$(".events-search").on('tap',function(){
		sendClickCode('gnb','shop_search:'+$("#keywords").val());
	});
	
	// 头部购物车 1-7
	$(".events-cart").on('tap',function(){
		sendClickCode('gnb','shop_cart');
	});
	
	// 头部在线客服 2-1
	$(".top-service").on('tap',function(){
		sendClickCode('gnb','shop_online service');
	});
	
	// 头部在登录 2-2
	$(".events-login").on('tap',function(){
		sendClickCode('gnb','shop_log in');
	});
	
	// 回到商城首页ylzhang add
	$(".top-nav-left").on('tap',function(){
		sendClickCode('gnb','utility menu:back shop home');
	});
	// 回到三星官网ylzhang add
	$(".back-offical-home").on('tap',function(){
		sendClickCode('gnb','utility menu:back offical home');
	});
	// 订单查询ylzhang add
	$(".top-order-search").on('tap',function(){
		sendClickCode('gnb','utility menu:order tracking');
	});
	
	//mini购物车
	$(".events-minicart").on('tap',function(){
		sendClickCode('gnb','utility menu:mini cart');
	});
	$(".icon-phone").on('tap',function(){
		sendClickCode('gnb','utility menu:etc');
	});
	
	// footer menu
	$(".footer-submenu").on('click','.footer-submenu > li > a',function(){
		sendClickCode('footer','footer:'+$(this).attr('footerSubmenuName'));
	});
	
	// 首页底部  回到商城首页ylzhang add
	$(".footer-back-shop-home").on('tap',function(){
		sendClickCode('footer','footer:back shop home');
	});
	
	/***  首页 分享 begin **/
	// follow weibo
	$(".icon-blog").on('tap',function(){
		sendClickCode('share','follow:Sina');
	});
	// follow wechat
	$(".icon-wechat").on('tap',function(){
		sendClickCode('share','follow:WeChat');
	});
	// follow wechat
	$(".icon-tencent-micro-blog").on('tap',function(){
		sendClickCode('share','follow:Tencent');
	});
	// follow 社区
	$(".icon-community").on('tap',function(){
		sendClickCode('share','follow:galaxyclub');
	});
	/***  首页 分享 end **/
	
	//foot bottom 
	$(".footer-bottom-left").on('click','li > a',function(){
		 var link=$(this).attr("href");
		 link=link.substring(link.lastIndexOf('/')+1,link.indexOf('.'));
		 sendClickCode('footer','footer:bottom_'+link);
	});

    // 循环选择头部二级导航元素 3-1~~~7-4
	// navigation 
	$(".submenu-wrap").on('tap','.sub-pro-show > li >a',function(){
		//remove the blank
		var text=$(this).text().trim();
		var name = $(this).parents('.sub-menu').eq(0).prev().attr('href');
		name=name.replace("/",'');
		sendClickCode('gnb','shop_'+name+':'+text);
	});
	
	// nav子分类ylzhang add
	$(".sub-pro-series").on('tap','li > a',function(){
		var hrefText = $(this).attr('href');
		var menuName = hrefText.split("/")[1];
		var category = hrefText.split("/")[2];
		sendClickCode('gnb','shop_' + menuName +':'+ category);
	});
	
	////sendMsOrderReturn('<order>');
	//<order> rule : ;[Model name];;;event37=[Price]|event38=[Quantity],
	$(".events-cancel-order").on('tap',function(){
		var orderInfo=new packorderInfo();	
		sendMsOrderCancel(orderInfo.toString());
	});

	
	//sendMsOrderCancel('<order>');
	$(".btn-unpaid").on('tap',function(){
		var orderInfo=new packorderInfo();
	    sendMsOrderReturn(orderInfo.toString());
	});
	
	$(".goPayment").on('tap',function(){
	    <!--yoyi tracing code start-->
        yoyi.track_event("立即支付");
	    <!--yoyi tracing code end-->

		var orderInfo=new packorderInfo();
	    sendMsOrderReturn(orderInfo.toString());
	//	  //console.log(sendMsOrderReturn(orderInfo.toString()));
	});
	
	
	 /*** 10. mini购物车删除 方法名:delMiniShoppingCart ***/
	 
	 /*** 10. mini购物车 去结算 ***/
     $('#toMiniPay').on('tap',function(){
         var modelName = "";
         $.each($(".mini-cart-list .minicart-list-right .minicart-list-title"), function(i, val){
             if(i > 0){
                 modelName += ",";
             }
             var tracingItemCode = $(this).attr("href");
             var itemCode=tracingItemCode.substring(6,tracingItemCode.length-4);
             modelName += ";"+itemCode;
         });
         sendScViewCat(modelName,modelName.replaceAll(";",""));
     });
	 
	 /*** 13. 新品推荐 ***/
	 $('.newRecommendTracing').on('tap',function(){
		 var tracingItemCode = $(this).attr("href");
         tracingItemCode = tracingItemCode.substring(6,tracingItemCode.length-4);
         sendScAddPrd(tracingItemCode,tracingItemCode);
	 });
	
	 /***  登录 相关begin ***/
	 $('#loginCommit').on('tap',function(){
		 sendClickCode('account','login:shop account'); 
	 });
	 //注册(Sign Up) 
	 $('.registerTracing').on('tap',function(){
		 sendClickCode('account','account:sign up');
	 });
	 //找回密码 
	 $('.look-password').on('tap',function(){
		 sendClickCode('account','account:find sign in info');
	 });
	 //结算会员登录
	 $('#loginCommitPay').on('tap',function(){
		 sendClickCode('account','login:samsung account');
	 });
	 //结算页游客登录结算
	 $('.sam-login-right .btn-bottom').on('tap',function(){
		 sendClickCode('account','login:guest');
	 });
	 //结算页查找邮件密码
	 $("#loginFormPay .sam-login-foot p a").on('tap',function(){
		 sendClickCode('account','account:find sign in info');
	 });
	 //结算页马上注册
	 $(".sam-login-right .guest-vip a").on('tap',function(){
		 sendClickCode('account','account:sign up');
	 });
	 
	 
	 /*** 21. SignOut ***/
	 $('#logOut').on('tap',function(){
		 sendClickCode('account','log out');
	 });
	 /***  登录 相关end ***/
	 
	 
	 /*** 15. PLP右侧(颜色切换) ***/
	 $('.img-cor-list .cur').on('tap',function(){
		 var tracingItemCode = $(this).find('a > i').attr('code');
		 sendClickCode('category_button',"shop category_color|" + tracingItemCode + "|;" + tracingItemCode);
	 });
	 
	 /*** 16. PDP上侧(颜色、内存版本) ***/
	 //颜色等属性选择ylzhang modify
	 $('.events-grid-right').on('tap', '.sam-grid-line .nav li', function(){
	   	if(($(this).hasClass("is-active") && taptimes!=0) || $(this).hasClass("is-disabled")){
	   		return;
	   	}
	   	var optionStyle =$($(this).parent().parent().find('label')[0]).text();
	   	if(!firstInPDP){
	   		var attrIsColor = $(this).parent().attr("uliscolor");
            var itemCodetem=itemBaseSubViewCommand.code;
            var itemName = $(".sam-grid-line")[0].firstElementChild.innerText
		   	if(attrIsColor == "true"){//点击的是颜色
		   		sendClickCode('option_click','shop pdp:option selector:color|;'+ itemName +"|" +itemCodetem);
		   	}else if(optionStyle.indexOf("内存") >= 0 ){//点击的是内存
		   		sendClickCode('option_click','shop pdp:option selector:storage');
		   	}else if(optionStyle.indexOf("版本") >= 0 ){//点击的是版本
		   		sendClickCode('option_click','shop pdp:option selector:version');
		   	}else if(optionStyle.indexOf("适用") >= 0 ){//点击的是适用
		   		sendClickCode('option_click','shop pdp:option selector:apply');
		   	}else if(optionStyle.indexOf("屏幕") >= 0 ){//点击的是适用
		   		sendClickCode('option_click','shop pdp:option selector:screen');
		   	}else if(optionStyle.indexOf("CPU") >= 0 ){//点击的是适用
		   		sendClickCode('option_click','shop pdp:option selector:CPU');
		   	}
	   	}
	   	firstInPDP = false;
	 });
	 
	 /*** 16. PDP上侧(Gallery) 方法名:pdpGalleryChange ***/
	 
	 /*** 17.1 PDP中侧(加入购物车) ***/
	 $('.events-addCart').on('tap',function(){
		 try {
			 var itemCodetem=itemBaseSubViewCommand.code;
			 sendScAddPrd(';'+itemCodetem,''+itemCodetem);
			 //console.log(sendScBasket(';'+itemCodetem,''+itemCodetem));
		} catch (e) {
			//console.log(e);
		}
	 });
	 /*** 17.2. PDP中侧立即购买 ***/
	 $('#immediatelyBuy').on('tap',function(){
		 try {
			 var itemCodetem=itemBaseSubViewCommand.code;
			 sendScBasket(';'+itemCodetem,''+itemCodetem);
			 //console.log(sendScBasket(';'+itemCodetem,''+itemCodetem));
		} catch (e) {
			//console.log(e);
		}
	 });

	 /*** 新增 PDP收藏 ***/
	 // 底部收藏按钮收藏
	 $('#btnfa').on('tap',function(){
         try {
             var itemCode = itemBaseSubViewCommand.code;
             if ($('#btnfa').text() == '收藏') {
                 sendCollPro(';' + itemCode, '' + itemCode);
             }
             if ($('#btnfa').text() == '我的收藏') {
                 sendCollProed(';' + itemCode, '' + itemCode);
             }
         } catch (e) {
             //console.log(e);
         }
	 });
	 //顶部爱心收藏
	 $('#coll-button').on("tap", function () {
         try {
             var itemCode = itemBaseSubViewCommand.code;
             if ($('#coll-button').attr('class').indexOf('before') > -1) {
                 sendCollPro(';' + itemCode, '' + itemCode);
             }
             if ($('#coll-button').attr('class').indexOf('after') > -1) {
                 sendCollProed(';' + itemCode, '' + itemCode);
             }
         } catch (e) {
             //console.log(e);
         }
	 });

	 /*** 17.3 PDP中侧(立刻秒杀)ylzhang add ***/
	 $('#btnqs').on('tap',function(){
		try {
			var itemCodetem=itemBaseSubViewCommand.code;
			sendScBasket(';'+itemCodetem,','+itemCodetem);
			//console.log(sendScBasket(';'+itemCodetem,''+itemCodetem));
		} catch (e) {
			//console.log(e);
		}
		loginFromBtnqs = true;
	 });
	 
	 /*** 17. PDP中侧(深入了解产品) ***/
	 $('.link').on('tap',function(){
		 try {
			 var itemCodetem=itemBaseSubViewCommand.code;
			 sendClickCode('category_button','learn more|'+itemCodetem+'|;'+itemCodetem);
			 //console.log(sendClickCode('category_button','learn more|'+itemCodetem+'|;'+itemCodetem));
		 } catch (e) {
				//console.log(e);
		 }
	 });
	 
	 /*** 17. PDP中侧(商品动态、规格参数、相关推荐menu) ***/
	 $('.sam-product-detail-container-nav.float-clearfix').on('tap','ul > li',function(){
		//标题行跳过
		var liIndex= $(this).index();
		if(0==liIndex){
			return;
		}
		 var menuName = $(this).attr('titleParam');
		 sendClickCode('jumpto','shop pdp jump to:'+ menuName);
	 });
	 
	 /*** 18. PDP下侧(查看更多规格参数) ***/
	 $('.events-parameter-more').on('tap',function(){
		 if($(this).hasClass('active')){
			 sendClickCode('jumpto','shop_see all:specs');
		 } else {
			 sendClickCode('jumpto','shop_hide all:specs');
		 }
	 });
	 
	 /*** 18. PDP下侧(相关推荐) ***/
	 $('.pdpRecommendTracing').on('tap',function(){
		 var tracingItemCode = $(this).attr("href");
         tracingItemCode = tracingItemCode.substring(6,tracingItemCode.length-4);
		 sendClickCode('finding_method',"shop pdp:related products|" + tracingItemCode + '|;' + tracingItemCode);
	 });
	 /*** PDP中测滚动图片 TODO ***/
	 $(".scroll-gallery-res ul").on('tap',function(){
		 var itemCodetem=itemBaseSubViewCommand.code;
		 sendClickCode('category_colorchip', 'shop gallery:image|'+ $(".sam-grid-line")[0].firstElementChild.innerText +'|' + itemCodetem);
	 });
	 /*** PDP以旧换新 ***/
	 $(".huanxin-button").on('tap', function(){
		 var itemCodetem=itemBaseSubViewCommand.code;
         // var data = loxia.syncXhrPost(FIND_SKU_EXTENTIONCODE_BY_ITEMCODE_URL, {"itemCode" : itemCodetem});
         // var extentionCode = data.extentionCode;
         // var modelCode = extentionCodeMap[extentionCode];
         // //map中没有查找到对应的modelCode，暂时存放itemCode
         // if(modelCode == undefined){
         //     modelCode = itemCodetem;
         // }
         sendClickCode('content_click', 'shop detail:trade in|;'+ itemCodetem +'|' + itemCodetem);
	 });
	 
	 /*** 19. 购物车 去结算 ***/
	 $(".shopcart-pay #toPay").on('tap',function(){
		 sendScCheckoutStep('basket:proceed to checkout');
	 });
	 
	 /*** 19. 购物车 继续购物 ***/
	 $('.shopcart-pay .buy-continue').on('tap',function(){
		 sendScCheckoutStep('basket:continue shopping');
	 });
	 /*** 加入购物车成功页面 继续购物 ***/
	 $('.sucess-nav-2 .go-buy').on('tap',function(){
		 sendScCheckoutStep('basket:continue shopping');
	 });
	 /***  购物车 您可能会喜欢***/
	 $('.shoppingCartRecommendProducts').on('tap',function(){
		 var itemCodeUrl=$(this).attr("href");
		 if(itemCodeUrl!=undefined){
			 var itemCode=itemCodeUrl.substring(itemCodeUrl.lastIndexOf("."), 1).replace("item/","").replace("/DS","");
			 if(itemCode == "" || itemCode == undefined){
				 return;
			 }
			 var data = loxia.syncXhrPost(FIND_SKU_EXTENTIONCODE_BY_ITEMCODE_URL, {"itemCode" : itemCode});
			 var extentionCode = data.extentionCode;
			 //var extentionCode = getSkuextentionCodeByItemCode(itemCode);
			 var modelCode = extentionCodeMap[extentionCode];
			//map中没有查找到对应的modelCode，暂时存放itemCode
			 if(modelCode == undefined){
					modelCode = itemCode;
				}
			 sendClickCode('finding_method','shop_recommended products|;'+itemCode+'|'+modelCode);
		 }
	 });
	 
	 /*** 19. 购物车 加入购物车 ***/
	 $('.my-events-addToCart').on('tap', function(){
		 try {
			var itemcodetem="";
			var urltem= $(this).prev().prev().attr("href");
			var skuId = $(this).attr("myskuid").replace(" ","");
			if(urltem!=undefined){
				//itemcodetem=urltem.substring(urltem.lastIndexOf('/')+1,urltem.indexOf('.')); 
				itemcodetem=urltem.substring(urltem.lastIndexOf("."), 1).replace("item/","").replace("/DS","");
			}
			if(skuId == "" || skuId == undefined){
				return;
			}
			var data = loxia.syncXhrPost(FIND_SKU_EXTENTIONCODE_BY_SKUID_URL, {"skuId" : skuId});
			var extentionCode = data.outid;
			var modelCode = extentionCodeMap[extentionCode];
			//map中没有查找到对应的modelCode，暂时存放itemCode
			if(modelCode == undefined){
				modelCode = itemcodetem;
			}
			sendScAddPrd(itemcodetem,modelCode);
		 } catch (e) {
		 }
	 });
	 /**空购物车页面用添加购物车方法*/
	 $('.my-events-addToShoppingCart').on('tap', function(){
		 try {
			 var itemcodetem="";
			 var urltem= $(this).prev().prev().attr("href");
			 if(urltem!=undefined){
				 itemcodetem=urltem.substring(urltem.lastIndexOf('/')+1,urltem.indexOf('.')); 
			 }
			 sendScAddPrd(itemcodetem,itemcodetem);
		 } catch (e) {
		 }
	 });
	 
	 /*** 22. Check Out-1(优惠码使用) ***/
	 $('#couponUse').on('tap',function(){
		 try {
			 var modelCode="";
			 $.each($(".sam-checkout-product"),function(index,element){
				 var code= $(element).attr("href");
				 if(code!=undefined){
					 code=code.replace("/item/","");
					 code=code.replace(".htm","");
					 modelCode+=";"+code+",";
				 }
			 });
			 modelCode = modelCode.substring(modelCode.lastIndexOf(","), 0);
			 var promocodetem=$("#couponCode").val();
			 sendScOrderApply(modelCode,promocodetem);
			 //console.log(sendScOrderApply(modelCode,'promo code'));
		 } catch (e) {
		 	//console.log(e);		
		 }

	 });
	 
	 /*** 22. Check Out-1(优惠券使用) ***/
	 $('.sam-checkout-promo-right .btn').on('tap',function(){
		 try {
			 var modelCode="";
			 $.each($(".sam-checkout-product"),function(index,element){
				 var code= $(element).attr("href");
				 if(code!=undefined){
					 code=code.replace("/item/","");
					 code=code.replace(".htm","");
					 modelCode+=";"+code+",";
				 }	
			 });
			 modelCode = modelCode.substring(modelCode.lastIndexOf(","), 0);
			 
			 var promocodetem=$("#couponCode").val();
			 sendScOrderApply(modelCode,promocodetem);
			 
		 } catch (e) {
		 }

	 });
	 
//	 /*** 22. Check Out-1(积分使用) ***/
//	 $('#pointsUsed').on('tap',function(){
//		 try {
//			 var modelCode="";
//			 $.each($(".sam-checkout-product"),function(index,element){
//				 var code= $(element).attr("href");
//				 if(code!=undefined){
//					 code=code.replace("/item/","");
//					 code=code.replace(".htm","");
//					 modelCode+=";"+code+","
//				 }
//			 });
//			 modelCode = modelCode.substring(modelCode.lastIndexOf(","), 0);
//			 var uPointstem=$("#uPoints").val();
//			 sendScOrderApply(modelCode,'samsung point');
//			 //console.log(sendScOrderApply(modelCode,'samsung point'));
//			 
//		 } catch (e) {
//		 	//console.log(e);		
//		 }
//
//	 });
//	
	 /*** 22. Check Out-2(提交订单)  fix ArvinChang TODO ***/
	 $('.events-submit').on('tap',function(){
		 var  modelCode="";
		 var  code="";
		 var modelName="";
		 $.each($(".sam-checkout-product"),function(index,element){
			 var code= $(element).attr("href");
             var extentioncode= $(element).attr("extentioncode");
			 if(code!=undefined){
				 code=code.replace("/item/","");
				 code=code.replace(".htm","");
				 modelCode+=";"+code+",";
			 }
			 if (extentioncode!=undefined){
			 	if(extentionCodeMap[extentioncode]==undefined){
                    modelName += ";"+code+",";
				}else{
                    modelName += ";"+extentionCodeMap[extentioncode]+",";
				}
			 }
		 });
         modelName = modelName.substring(modelName.lastIndexOf(","), 0)
         modelCode = modelCode.substring(modelCode.lastIndexOf(","), 0);
         code = modelCode.replaceAll(";","").replace("/DS","");
         sendScCheckoutStep('checkout:place order',modelCode,code);
         sendScCheckout(modelName,code);
	 }); 

	  /*** 25. 支付结果页  立即支付 ***/
	  $('.orderbtn-box #toPay').on('tap',function(){
		  sendScCheckoutStep('checkout:pay now');
	  });
	 
	 /*** 27. 订单查询-会员 ***/
	 $('#loginCommitOrder').on('tap',function(){
		 sendClickCode('finding method','shop_orderlist:member');
	 });
	 
	 /*** 27. 订单查询-游客 ***/
	 $('.guestOrderTracing').on('tap',function(){
		 sendClickCode('finding method','shop_orderlist:guest');
	 });
	
	 /***PLP左侧分类 选择**/
	 $(".list-nav-level1").on('tap','ul>li>a',function(){
		 sendClickCode('category_filter','shop:category filter:line');
	 });
	 
	 // PLP页左侧 颜色选择ylzhang modify
	 $(".color-listing").on('tap','ul>li>a',function(){
			 sendClickCode('category_filter','shop:category filter:color');
	 });
	 
	 // PLP页左侧 价格选择ylzhang modify
	 $(".price-filter").on('tap','ul>li>label>i',function(){
			 sendClickCode('category_filter','shop:category filter:price');
	 });
 
	 $(".promotion-filter").on('tap','ul>li',function(){
		 sendClickCode('category_filter','shop:category filter:promotion');
	 });
	 /****plp点击商品图片跳转PDP***/
	 $("#sku_list .list-boximg a").on('tap',function(){
		var itemCodeUrl=$(this).attr('href');
		if(itemCodeUrl!=undefined){
			 var itemCode= itemCodeUrl.substring(itemCodeUrl.lastIndexOf("/"), 1).replace("item/","");
			 sendClickCode('finding_method','shop category:product grid_learn more|'+itemCode+'|'+itemCode);
		 }
		 
	 });
	 /****plp点击商品名称跳转PDP***/
	 $("#sku_list .product-name a").on('tap',function(){
		 var itemCodeUrl=$(this).attr('href');
		 if(itemCodeUrl!=undefined){
			var itemCode= itemCodeUrl.substring(itemCodeUrl.lastIndexOf("/"), 1).replace("item/","");
			sendClickCode('finding_method','shop category:product grid_learn more|'+itemCode+'|'+itemCode);
		 }
	 });
	 /****plp点击商品 色块***/
	 $("#sku_list .img-list-pdcenter li .thumbnail").on('tap',function(){
		 var itemCode=$(this).find('i').attr('code');
		 if(itemCode!=undefined){
			 sendClickCode('category_colorchip','shop category_color|'+itemCode+'|;'+itemCode);
		 }
	 });
	 
	 /***1 点击添加地址 ***/
	 $('.events-add-address').on('tap', function(){
		 sendClickCode('myacount_address','add address:shipping');
	 });
	 
	 /***2 保存地址 ***/
	 $('.sam-checkout-group').on('tap', '.events-btn-save', function(){
		 sendClickCode('myacount_address','add address:save');
	 });
	 
	 /***3 取消保存地址 ***/
	 $('.myaccount-body').on('tap','.events-btn-cancel', function(){
		 sendClickCode('myacount_address','add address:cancel');
	 });
	 
	//首页大小KV 图片点击   
	$(".events-banner").on('tap','div>div>ul>li>a',function(){
		var subscript= $('.events-banner').find(".scroll-dots > a[class='active']").html();
		subscript = subscript.replace("<i></i>","");
		var url = $(this).attr('href');
		url=url.substring(url.lastIndexOf("/")+1, url.length).replace(".htm","");
		var date = $(this).attr('uploaded-date');
		sendClickCode('pid','cn shop_home_kv_contents_image'+'_'+url+'_'+date);
	});
	//首页大小KV 圆点点击
	$(".events-banner").on('tap',".scroll-dots > a",function(){
		 var subscript = $(this).text();
		 sendClickCode('content_click_count','rolling:index_'+parseInt(subscript));
	});
	//首页banner图片点击
	$(".subbanner-section").on('tap',"div>div",function(){
		 var contents = $(this).find('a').attr("href")
		 contents =contents.substring(contents.lastIndexOf("/")+1, contents.length).replace(".htm","");
		 var date = new Date().Format('yyyyMMdd');
		 sendClickCode('pid','cn shop_home_contents_image_'+contents+'_'+date);
	});

	// 顶部通栏事件
	$('.top_fence').on('tap', 'div', function () {
		var url = $(this).find("a").attr("href")
		url = getCodeFromUrl(url)
		var date = new Date().Format('yyyyMMdd');
		sendClickCode('pid','cn shop_home_kv_contents_image'+'_'+url+'_'+date);
	})

	//PLP页面-排序方式
	$(".sort-style-r").on('tap',"ul>li",function(){
		 var sortStyle = $(this).attr('sortStyle');
		 sendClickCode('category_filter','shop:sort by_'+sortStyle);
	});
	
	//首页-配件
	$(".accessories-right").on('tap','a',function(){
		 sendClickCode('content_click_count','kv rolling:right arrow_1');
	});
	$(".accessories-left").on('tap','a',function(){
		 sendClickCode('content_click_count','kv rolling:left arrow_2');
	});
	$(".accessories-products").on('tap','a',function(){
		sendProducts($(this), 'shop_top selling products');
	});
	//首页-本周热销
	$(".hotSelling-rotation").on('tap','a',function(){
		sendProducts($(this), 'shop_top selling products');
	});
	
	//首页-为你推荐
	$(".recommend-products-left").on('tap','a',function(){
		 sendClickCode('content_click_count','kv rolling:left arrow_2');
	});
	$(".recommend-products-right").on('tap','a',function(){
		 sendClickCode('content_click_count','kv rolling:right arrow_1');
	});
	$(".recommend-products").on('tap','a',function(){
		sendProducts($(this), 'shop_recommended products');
	});
	//购物车点击删除的时候
	$('.shopcart-list-content').on('tap','.shopcart-remove' ,function(){
		var code = $(this).parent().prev().prev().prev().find('a').attr('href');
		 code=code.replace("/item/","");
		 code=code.replace(".htm","");
		 sendScRemove(';'+code,code);
	});
	// TODO 14
	$(".new-recommend-color-section").on('tap','div>div>div',function(){
		 var code = $(this).find('a').attr("href");
		 code=code.replace("/item/","");
		 code=code.replace(".htm","");
		 var name = $(this).find('a').find('h2').html();
		 sendClickCode('finding_method', 'shop_recommended products|;'+code+'|'+code);
	});
	
	/** 立即预定按钮 */
	$("#btnbuy").on('tap', function(){
		var itemCode = itemBaseSubViewCommand.code;
		sendClickCode('content_click','shop item:' + itemCode + '_preorder');
		
	});
	
	// // 活动页面js
	// $(".ActivityEventLink").on("tap",function(){
	// 	var itemCodeUrl=$(this).attr("href");
    //     var itemName=$(this).attr("itemName");
    //     var itemCode=itemCodeUrl.substring(itemCodeUrl.lastIndexOf("."), 0).replace("https://www.samsungeshop.com.cn/item/","").replace("/DS","");
    //    sendClickCode('finding_method','shop event_'+itemName+'|;'+itemCode+'|'+itemCode);
    // });
	 
});

/*** 22. Check Out-2(重新支付) ***/
function sendScCheckoutModifyFun() {
	sendScCheckoutStep('checkout:pay again');
}

/*** 22. Check Out-2(已完成付款) ***/
function sendScCheckoutFun() {
	sendScCheckoutStep('checkout:completed');
}

function test(){
		
	 var modelCode=";";
	 $.each($(".sam-checkout-product"),function(index,element){
		 var code= $(element).attr("href");
		 code=code.substring(code.lastIndexOf('/')+1,code.indexOf('.')); 	
		 modelCode+=";"+code+",";
	 });
	 modelCode = modelCode.substring(modelCode.lastIndexOf(","), 1);
	 //console.log(modelCode);
	 sendScCheckout(modelCode);
}


/*** 获取订单详情页面的订单信息**/
function packorderInfo(){
		var orderInfo, productCode, salePrice, qty;
		// 1 product : ;efc-1g2nge;;;event37=25.00|event38=1
		var orderInfo, productCode, salePrice, qty;
		var itemCount = $("#itemCount").val();
		if (itemCount != undefined && itemCount < 2) {
			productCode = $("#productCode").val();
			salePrice = $("#salePrice").val();
			qty = $("#qty").val();
			orderInfo = "product:;" + productCode
					+ ";;;event37=" + salePrice + "|event38=" + qty;
		} else {
			orderInfo = "multi products:";
			var products = "";
			for (var i = 0; i < itemCount; i++) {
				productCode = $("#productCode" + (i + 1)).val();
				salePrice = $("#salePrice" + (i + 1)).val();
				qty = $("#qty" + (i + 1)).val();
				products += ";" + productCode + ";;;event37="+ salePrice + "|event38=" + qty + ",";
			}
			products = products.substring(products.lastIndexOf(","), 1);
			orderInfo = orderInfo + products;
		}
		//console.log(orderInfo);
	}






//order completion 
//After order completion, when success page is loading, call to sendScPurchaseSucc()
//When order completion is failed, call to sendScPurchaseFail()

//order completion  success
//sendScPurchaseSucc('<order>','<purchase_id>','<delivery_options>','<payment_method>','<payment_option>'); 
//payment_method  card : visa  mater  etc.  COD: cash on delivery exc: alipay .....
//paymentOption explain  promotion code/coupon/samsung point  只 确定是否使用  "yes:yes:yes" or "no:no:no"  other.....\
//delivery_options  这里发货方式 我们是没有选择的 这里默认给 顺丰 'SF'
//purchase_id  use order Number  example  
function orderCompletionSuccess(){
	 var orderNo,paymentMethod,deliveryOptions;
	 var paymentOption = '';
	 deliveryOptions='SF';
	 paymentMethod="cash on delivery";
	 
	 var payMent=$("#payInfo").val();
	 if(payMent=='货到付款'){
		 paymentMethod ="cash on delivery";
	 }else if (payMent=='微信支付'){
		 paymentMethod ="wechat"; 
	 }else if (payMent.indexOf('分期付款')!=-1){
		 paymentMethod ="installment"; 
	 }else if (payMent.indexOf('银联')!=-1){
		 paymentMethod ="unionpay"; 
	 }else{
		 paymentMethod ="alipay"; 
	 }	 
	 var samPoint,discount;
	 var orderInfo=jointOrderInfo();
	 orderNo= $("#orderCode").val();
	 samPoint= parseFloat($("#samPoint").val()); 
	 discount=parseFloat($("#discount").val());
	 
	 if(discount>0){
		 paymentOption+="yes:yes:";
	 }else{
		 paymentOption+="no:no:";
	 }
	 if(samPoint>0){
		 paymentOption+="yes";
	 }else{
		 paymentOption+="no";
	 }
	 console.log(' order:'+orderInfo+'\n',
			 	'purchase_id:'+orderNo+'\n',
			 	'delivery_options:'+deliveryOptions+'\n',
			 	'payment_method:'+paymentMethod+'\n',
			 	'payment_option:'+paymentOption);
//	 (orderInfo,orderNo,deliveryOptions,paymentMethod,paymentOption)
	 sendScPurchaseSucc(orderInfo,orderNo,deliveryOptions,paymentMethod,paymentOption);
}

/**
 * 遍历商品名并用逗号拼接
 */
function jointOrderInfo(){
	var orderInfo= "";
	$(".orderInfo").each(function(){
		//中文商品名用itemCode代替
		orderInfo+=';'+$(this).find('.itemCode').val()+';'+$(this).find('.count').text()+';'+$(this).find('.goods-money-box').text().replace('￥', '')+',';
    });
	return orderInfo.substring(0,orderInfo.length-1);
}
 
//order completion  failed
//sendScPurchaseFail('<order>','<purchase_id>','<tracking_value>');
//trackingValue  错误信息给 "" 
//parameters 
 function orderCompletionFailed(){
	 var orderInfo,orderNo,trackingValue,pName,price,qty;
	 orderInfo="none";
	 orderNo= $("#orderCode").val();
	 trackingValue="";
	 sendScPurchaseFail(orderInfo,orderNo,trackingValue);
	 //console.log(sendScPurchaseFail(orderInfo,orderNo,trackingValue));
 }

/*** 10. mini购物车删除 方法名:delMiniShoppingCart ***/
 function delMiniShoppingCart(deleteItemCode) {
	 //console.log(";" + deleteItemCode);
 	 sendScRemove(deleteItemCode,deleteItemCode);
 	 //console.log(sendScRemove(";" + deleteItemCode));
 }


Date.prototype.Format = function (fmt) { // author: meizz
	var o = {  
		"M+": this.getMonth() + 1, //月份   
	    "d+": this.getDate(), //日   
	    "H+": this.getHours(), //小时   
	    "m+": this.getMinutes(), //分   
	    "s+": this.getSeconds(), //秒   
	    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
	    "S": this.getMilliseconds() //毫秒   
	};  
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
	for (var k in o)  
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
	return fmt;  
};

function sendProducts(element, shopName){
	var code = element.attr("href");
	code=code.replace("/item/","");
	code=code.replace(".htm","");
	sendClickCode('finding_method', shopName +'|;'+ code + '|'+code);
}

function fcTrack(type,data,agent){
    var eVar6 = getOmniInputTagValue("pageTrack");
    var eVar39 = window.location.href;
    var eVar40 = s.pageName;
    if(eVar40.indexOf(":shop") > -1){
        data = "shop:" + data;
    }
    if (agent==undefined||agent==null||agent=='') {
        if(type == "click"){
            s_control_click('events,eVar26,eVar6,eVar39,eVar40', 'event26', 'event26 , '+ data + ', ' + eVar6 + ', ' + eVar39 + ', ' + eVar40, 'o', 'microsite conversion type');
        } else if (type == "submit"){
            s_control_click('events,eVar30,eVar6,eVar39,eVar40', 'event30', 'event30 , '+ data + ', ' + eVar6 + ', ' + eVar39 + ', ' + eVar40, 'o', 'microsite conversion type');
        } else if (type == "download"){ 
            s_control_click('events,eVar32,eVar6,eVar39,eVar40', 'event32', 'event32 , '+ data + ', ' + eVar6 + ', ' + eVar39 + ', ' + eVar40, 'o', 'microsite conversion type');
        } 
    } else {
        if(type == "click"){
            s_control_click('events,eVar26,eVar6,eVar39,eVar40,eVar70', 'event26', 'event26 , '+ data + ', ' + eVar6 + ', ' + eVar39 + ', ' + eVar40 + ', ' + agent, 'o', 'microsite conversion type');
        } else if (type == "submit"){
            s_control_click('events,eVar30,eVar6,eVar39,eVar40,eVar70', 'event30', 'event30 , '+ data + ', ' + eVar6 + ', ' + eVar39 + ', ' + eVar40 + ', ' + agent, 'o', 'microsite conversion type');
        } else if (type == "download"){
            s_control_click('events,eVar32,eVar6,eVar39,eVar40,eVar70', 'event32', 'event32 , '+ data + ', ' + eVar6 + ', ' + eVar39 + ', ' + eVar40 + ', ' + agent, 'o', 'microsite conversion type');
        }
    }
}
