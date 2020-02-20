$(function(){
	/** 页面加载之前搜索框置空（后退搜索框置空）*/
	 window.onbeforeunload = function(){
	     $("#keywords").val("");
	 }
	 
	/**
	 *  search box 
	 */
	$(".events-search").on('click',function(){
		  var keyword = $("#keywords").val();
		  if(keyword=='' ||keyword==null){
			  keyword='';
		  }
		  self.location = base+'/search?q='+ keyword;
	});

	/**
	 *  search box  enter 
	 */
	$('#keywords').bind('keypress',function(event){
	    if(event.keyCode == "13")    
	    {
	    	var keyword = $("#keywords").val();
	    	self.location = base+'/search?q='+ keyword;
	    }
	});
 
  
});

