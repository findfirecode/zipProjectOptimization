$(function() {
	var monMap = new Map();
	// S9+
	monMap.put("SM-G9650/DS勃艮第红", "163b9414c41");
	monMap.put("SM-G9650/DS谜夜黑", "163b940f87e");
	monMap.put("SM-G9650/DS莱茵蓝", "163b942190d");
	monMap.put("SM-G9650/DS夕雾紫", "163b941b380");
	monMap.put("SM-G9650/DS64G", "163b94258a9");
	monMap.put("SM-G9650/DS128G", "163b941eeee");
	monMap.put("SM-G9650/DS256G", "163b94219cb");
	monMap.put("SM-G9650/DS公开版", "163b942c57c");
	monMap.put("SM-G9650/DS", "163b9426578");
	// S9
	monMap.put("SM-G9600/DS勃艮第红", "163b942c5ed");
	monMap.put("SM-G9600/DS谜夜黑", "163b9436757");
	monMap.put("SM-G9600/DS莱茵蓝", "163b942fb0e");
	monMap.put("SM-G9600/DS夕雾紫", "163b9431e49");
	monMap.put("SM-G9600/DS64G", "163b94396b5");
	monMap.put("SM-G9600/DS128G", "163b945fdc5");
	monMap.put("SM-G9600/DS公开版", "163b946a254");
	monMap.put("SM-G9600/DS", "163b9463679");
	// S8+
	monMap.put("SM-G9550勃艮第红", "163b946da6f");
	monMap.put("SM-G9550谜夜黑", "163b9466c8a");
	monMap.put("SM-G9550烟晶灰", "163b947b4f3");
	monMap.put("SM-G9550雾屿蓝", "163b9470d0d");
	monMap.put("SM-G9550芭比粉", "163b9469e8b");
	monMap.put("SM-G95504GB RAM 64GB ROM", "163b948581a");
	monMap.put("SM-G95506GB RAM 128GB ROM", "163b947edb8");
	monMap.put("SM-G9550公开版", "163b94890ac");
	monMap.put("SM-G9550", "163b9482abf");
	// S8
	monMap.put("SM-G9500勃艮第红", "163b948e8ef");
	monMap.put("SM-G9500谜夜黑", "163b94e56e7");
	monMap.put("SM-G9500烟晶灰", "163b94ef2f4");
	monMap.put("SM-G9500雾屿蓝", "163b94e7136");
	monMap.put("SM-G9500芭比粉", "163b94f5b11");
	monMap.put("SM-G95004GB RAM 64GB ROM", "163b94faa18");
	monMap.put("SM-G95006移动4G+版", "163b95054dd");
	monMap.put("SM-G9500公开版", "163b9507519");
	monMap.put("SM-G9500", "163b95091fd");
	// Note8
	monMap.put("SM-N9500星河蓝", "163b9506a4e");
	monMap.put("SM-N9500谜夜黑", "163b950d7c0");
	monMap.put("SM-N9500旷野灰", "163b95158e1");
	monMap.put("SM-N9500芭比粉", "163b9503444");
	monMap.put("SM-N950064GB", "163b952042c");
	monMap.put("SM-N9500128G", "163b9541181");
	monMap.put("SM-N9500256G", "163b954335f");
	monMap.put("SM-N9500公开版", "163b953cd9f");
	monMap.put("SM-N9500", "163b95473f3");
	// C8
	monMap.put("SM-C7100墨玉黑", "163b9541eaf");
	monMap.put("SM-C7100枫叶金", "163b9543aae");
	monMap.put("SM-C7100蔷薇粉", "163b954076a");
	monMap.put("SM-C71003GB RAM 32GB ROM", "163b954da42");
	monMap.put("SM-C71004GB RAM 64GB ROM", "163b955222f");
	monMap.put("SM-C7100公开版", "163b955108b");
	monMap.put("SM-C7100", "163b955678f");
	//以旧换新
	var monMapB = new Map();
	monMapB.put("SM-G9650/DS", "163bafc3fd7");
	monMapB.put("SM-G9600/DS", "163bafcdd8d");
	monMapB.put("SM-G9500", "163bafc8705");
	monMapB.put("SM-N9500", "163bafca060");
	function YoyiTrack(mon) {
		var url = 'https://databank.yoyi.com.cn/e.gif?mon=' + mon;
		var d = new Image(1, 1);
		d.src = url + "&r=" + Math.random();
		d.onload = function() {
			d.onload = null;
		}
	};

	function YoRegTrack(mon) {
		YoyiTrack(mon);
	}

	$('.events-grid-right').on('tap', '.sam-grid-line .nav li', function() {
		var code = $('#itemId').attr('itemcode');
		var color = $(this).find('itempropertyname').text();
		var mon = monMap.get(code + color);
		if (isNull(mon)) {
			return;
		}
		YoRegTrack(mon);
	});

	$('.events-addCart').on('tap',function() {
		var code = $('#itemId').attr('itemcode');
		var mon = monMap.get(code);
		if (isNull(mon)) {
			return;
		}
		YoRegTrack(mon);
	});
	
	$('.huanxin-button').on('tap',function() {
		var code = $('#itemId').attr('itemcode');
		var mon = monMapB.get(code);
		if (isNull(mon)) {
			return;
		}
		YoRegTrack(mon);
	});
});
