function SaSso(){
	
	var loginName = "";
	
	/**
	 * 获取SA账号信息回调
	 */
	window.onGetSAInfo = function(SAID){
		var SAIDObj = JSON.parse(SAID);
		if(isNull(SAIDObj.mSAGUID)){
			loginName = SAIDObj.mSAID;
			// 获取SA账号的GUID
			window.SamsungAccount.getSAGuID('onGetSAGuid');
		}else{
			stoLogin(SAIDObj.mSAGUID,SAIDObj.mSAID);
		}
	};
	
	/**
	 * 发起实名认证回调
	 */
	window.nameCheck = function(nameCheck){
		var nameCheckObj = JSON.parse(SAStatus);
		if(nameCheckObj.nameCheckStatus == 'checked'){
			// 获取SA账号信息，完成登录
			window.SamsungAccount.getSAID('onGetSAInfo');
		}else{
			// 实名验证异常
			console.log("实名验证异常！");
			return;
		}
	};
	
	/**
	 * 商城端获取S助手自动登录回调
	 */
	window.getSaStatus = function(SAStatus){
		var SAStatusObj = JSON.parse(SAStatus);
		if(SAStatusObj.loginStatus =='login' && SAStatusObj.nameCheckStatus == 'checked'){
			// 获取SA账号信息
			window.SamsungAccount.getSAID('onGetSAInfo');
		}else if(SAStatusObj.loginStatus == 'logout'){
			// 登录三星账户
			window.SamsungAccount.login(true,'onLoginSamsung');
		}else if(SAStatusObj.loginStatus == 'login' && SAStatusObj.nameCheckStatus =='need_check'){
			// 调用发起实名认证
			window.SamsungAccount.nameCheck('nameCheck');
		}
	};
	
	/**
	 * 商城端获取S助手手动登录状态回调
	 */
	window.getIndexSaStatus = function(SAStatus){
		var SAStatusObj = JSON.parse(SAStatus);
		if(SAStatusObj.loginStatus == 'login' && SAStatusObj.nameCheckStatus =='checked'){
			// 获取SA账号信息
			window.SamsungAccount.getSAID('onGetSAInfo');
		}else if(SAStatusObj.loginStatus =='login' && SAStatusObj.nameCheckStatus == 'need_check'){
			// 调用发起实名认证
			window.SamsungAccount.nameCheck('nameCheck');
		}else{
			return;
		}
	};
	
	/**
	 * 获取SA账号的GUID回调
	 */
	window.onGetSAGuid = function(SAGuID){
		//商城端登录获取GUID失败
		if(isNull(SAGuID)){
			console.log("获取SAGuID失败！");
			return;
		}
		stoLogin(SAGuID,loginName);
	};
	
	/**
	 * onLogin回调
	 */
	window.onLoginSamsung = function(SAStatus){
		var loginObj = JSON.parse(SAStatus);
		if(loginObj.loginStatus == 'login' && loginObj.nameCheckStatus == 'need_check'){
			// 调用发起实名认证
			window.SamsungAccount.nameCheck('nameCheck');
		}else if(loginObj.loginStatus == 'login' && loginObj.nameCheckStatus == 'checked'){
			// 获取SA账号信息
			window.SamsungAccount.getSAID('onGetSAInfo');
		}else{
			return;
		}
	};
	
	/**
	 * S助手自动登录
	 */
	this.autoLogin = function(){
		if(window.SamsungAccount.getSAGuID){
			// 获取SA登录状态
			window.SamsungAccount.getSAStatus('getIndexSaStatus', false);
		}else{
			return;
		}
	};
	
	/**
	 * S助手商城端登录
	 */
	this.saLogin = function(){
		if(window.SamsungAccount.getSAGuID){
			// 获取SA登录状态
			window.SamsungAccount.getSAStatus('getSaStatus', false);
		}else{
			alert("请升级S助手版本");
			return;
		}
	};
	
	/**
	 * 用GUID获取用户详情，完成商城端登录
	 */
	function stoLogin(guid,loginName){
		var loginData = loxia.syncXhr(loxia.encodeUrl(base + "/member/saSsoLogin.json?loginName="+loginName+'&guid='+guid));
		if(loginData.isSuccess){
			stoAutoLogin();
			loadNum();
		}else{
			var _w = $(window).width();
			if (_w < 1025 && $('.mob-slider-box').is(':visible')) {
				$('.events-mob-menu').trigger('tap');
			}

			showTip("由于您的会员注册信息不完整，请通过电脑端浏览器进入三星网上商城，登录后按提示，完善个人信息！");
			console.log("S助手登录，通过guid获取用户信息失败！");
		}
	};
	
	function showTip(msg){
		   noticeDialog = $.spice.dialog({
	           dialogClass: 'dialog-notice'
	           , fixed: true
	           , title: '<i class="icon icon-wrong"></i>'+msg+''
	           , button: ['确定']
	           , submit: function(){
	               noticeDialog.hide();
	           }
	       });	
		   noticeDialog.show();
	}
}