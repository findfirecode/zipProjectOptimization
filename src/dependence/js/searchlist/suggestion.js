/**
 * 搜索联想
 */

//listing pages
/*$(function(){
	
		var $searchInput = $('#keywords');
		
		var timeoutid = null; //定时器
		
		//清空下拉列表的内容并且隐藏下拉列表区 
		var clear = function() {
			$('.search_result_text').empty().hide();
		};
		//注册事件，当输入框失去焦点的时候清空下拉列表并隐藏 
		$searchInput.blur(function() {
			setTimeout(clear, 500);
		});			
		
		var selectedItem = null;
		
		var setSelectedItem = function(item) {
			//更新索引变量 
			selectedItem = item;
			//按上下键是循环显示的，小于0就置成最大的值，大于最大值就置成0 
			if (selectedItem < 0) {
				selectedItem = $searchResultText.find('a').length - 1;
			} else if (selectedItem > $searchResultText.find('a').length - 1) {
				selectedItem = 0;
			}
			//首先移除其他列表项的高亮背景，然后再高亮当前索引的背景 
			$searchResultText.find('a').removeClass('highlight').eq(selectedItem).addClass('highlight');
		};	
		
		
		
		var ajax_request = function() {
			//ajax 
			var url=loxia.getTimeUrl(base+"/getSuggWord.json");
			var keyword = $searchInput.val();
	 		
			$.ajax({
				url:url, 
				data: {'keyword' : keyword},
				type: "post",
				async:true,
				dataType : 'json', //返回数据类型 
				success:function(data) {
					 $('.search_result_text').empty();
			           if (data.isSuccess) {
							var msgs = data.description;
							console.log(msgs);
							var htmlCode="";
							for(var i=0;i<msgs.length;i++){
								htmlCode+=' <li> <a href="'+(base+'/search?q='+msgs[i])+'">'+msgs[i]+'</a>  </li>';
							}
							console.log(htmlCode);
							$('.search_result_text').show();
							$searchInput.parent().find(".search_result_text").stop(true, true).slideDown();	
						}
				}
			});
			
		   };	
		
			$searchInput.keyup(
					function(event){
						if (event.keyCode > 40 || event.keyCode == 8 || event.keyCode == 32) {
							//首先删除下拉列表中的信息 
							//$autocomplete.empty().hide();
							$('.search_result_text').empty().hide();
							clearTimeout(timeoutid);
							timeoutid = setTimeout(ajax_request, 100);
						}else if(event.keyCode == 38){ //上
							if (selectedItem == -1) {
								setSelectedItem($searchResultText.find('a').length - 1);
							} else {
								//索引减1 
								setSelectedItem(selectedItem - 1);
							}							
							event.preventDefault();
						}else if(event.keyCode == 40){ //下
							if (selectedItem == -1) {
								setSelectedItem(0);
							} else {
								//索引加1 
								setSelectedItem(selectedItem + 1);
							}							
							event.preventDefault();
						}
					}
			).keydown(
					function(event){
						if(event.keyCode==27){
							$('.search_result_text').empty().hide();
							event.preventDefault();
						}
					}
			)
			
			$searchInput.keypress(
					function(){
						if(event.keyCode == 13){
							//回车
							$('.c-search-btn').trigger('click');
							event.preventDefault();
						}						
					}
			);
	
});*/

$(function(){
	
	var $searchInput = $('#keywords');
	var timeoutid = null; //定时器
//	setTimeout(clear, 500);

	$('.events-search input').keyup(function() {
	 
	  setTimeout(ajax_request, 100);
	  
      $('.events-search').find('.sub-menu').show();
      $('.events-search .tinyscrollbar').removeData('plugin_tinyscrollbar');
      $.spice.tinyscrollbar('.events-search .tinyscrollbar', {
               wheelLock: true
               , touchLock: false
             });
    });

    $('.events-search').on('tap', '.sub-menu li a', function(event) {
      var $self = $(this)
          , aText = $self.text();
      $('.btn input', $self.closest('.dropdown')).val(aText);
      $self.closest('.sub-menu').hide();
      
    });

    $(window).on('tap', function(e){
      if( !($(e.target).hasClass('nav-search') || $(e.target).closest('.nav-search').length != 0)){
        $('.events-search').find('.sub-menu').hide();
        
//        setTimeout(ajax_request, 500);
      }
    });
    
    
    
});  


var clear = function() {
	$('.events-search').find('.sub-menu').hide();
};

var ajax_request = function() {
	//ajax 
	var url=loxia.getTimeUrl(base+"/getSuggWord.json");
	var keyword = $('#keywords').val();
		
	$.ajax({
		url:url, 
		data: {'keyword' : keyword},
		type: "post",
		async:true,
		dataType : 'json', //返回数据类型 
		success:function(data) {
			$('.events-search').find('.suggestion-result-text').empty();
	           if (data.isSuccess) {
					var msgs = data.description;
					console.log(msgs);
					var htmlCode="";
					for(var i=0;i<msgs.length;i++){
						htmlCode+=' <li> <a href="'+(base+'/search?q='+msgs[i])+'">'+msgs[i]+'</a>  </li>';
					}
//					console.log(htmlCode);
//					$('.search_result_text').show();
//					$('.events-search').find('.suggestion-result-text').append(htmlCode);
					$('.events-search').find('.suggestion-result-text').append(htmlCode)
					console.log(htmlCode);
				//	$searchInput.parent().find(".search_result_text").stop(true, true).slideDown();	
				}
		}
	});
   };
