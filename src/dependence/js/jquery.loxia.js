(function($) {
        if(typeof this["loxia"] === "undefined"){
                var _g = this;
                this.loxia = {                                         
                        global : _g,    //global ref                        
                        windowFeatures : "toolbar=no, menubar=no,scrollbars=yes, resizable=no,location=no, status=no", //default window features
                    
                        /*decide whether object is one string object or not */
                        isString: function(obj){
                                return typeof obj === "string" || obj instanceof String;
                        },
                        formatNumber: function(num){
                        	num = num + "";
                        	var x = num.split('.');
                        	var x1 = x[0], x2 = x.length > 1 ? '.' + x[1]: '';                        	
                        	x1 = x1.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                        	return x1+x2;
                        },
                        /*get viewport */
                        getViewport : function(){
                                var w, h;                                        
                                // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight                       
                                if (typeof window.innerWidth != 'undefined'){
                                     w = window.innerWidth, h = window.innerHeight;
                                }                        
                                // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
                                else if (typeof document.documentElement != 'undefined'
                                    && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0){
                                      w = document.documentElement.clientWidth, h = document.documentElement.clientHeight;
                                }                                                                        
                                else { // older versions of IE          
                                      w = document.getElementsByTagName('body')[0].clientWidth, h = document.getElementsByTagName('body')[0].clientHeight;
                                }
                                return {width : w, height : h};
                        },      
                        /* center layer in parent body */
                        center : function(layer, parent){
                                var d = {},top = 0,left = 0,
                                        scrollLeft = 0,scrollTop = 0;
                                if(parent){
                                        d.width = $(parent).width();
                                        d.height = $(parent).height();  
                                }else{
                                        d = this.getViewport();
                                        scrollLeft = $("html").scrollLeft();
                                        scrollTop = $("html").scrollTop();
                                }
                                if(parent){
                                        left = $(parent).offset().left;
                                        top = $(parent).offset().top;
                                }
                                $(layer).css({
                                        position: 'absolute',
                                        left: (scrollLeft + left + (d.width - $(layer).width())/2) + 'px',
                                        top: (scrollTop + top + (d.height - $(layer).height())/2) + 'px'
                                });
                        },
                        
                        /* encode url with timestamp, timestamp is added in default.*/
                        encodeUrl: function(url, withTimeStamp){                                        
                            var index = url.indexOf("?");
                            if (index === -1) 
                                if(withTimeStamp === undefined || withTimeStamp)
                                        return this.getTimeUrl(url);
                                else
                                        return url;

                            var result = url.substring(0, index + 1),
                                params = url.substring(index + 1).split("&");

                            for (var i=0; i < params.length; i++){
                                if (i > 0) result += "&";
                                var param = params[i].split("=");
                                result += param[0] + "=" + encodeURIComponent(param[1]);
                            }
                            if(withTimeStamp === undefined || withTimeStamp)
                                result = this.getTimeUrl(result);
                            return result;
                        },       
                        
                        getTimeUrl: function(url){
                        	var iTime = (new Date()).getTime();
                        	if(url.indexOf("loxiaflag=") >=0){
                        		url = url.replace(/loxiaflag=\d{13}/,"loxiaflag=" + iTime.toString());
                        		return url;
                        	}
                        	url += (/\?/.test(url))?"&":"?";
                        	return (url + "loxiaflag=" + iTime.toString());
                        },
                        
                        /*get value from object*/
                        getObject: function(propName, context){
                                context = context || _g;
                                var parts = propName.split(".");                        
                                for(var i=0, pn; context &&(pn = parts[i]); i++){
                                        context = (pn in context ? context[pn] : undefined);
                                }
                                return context;
                        },
                        /*set value to object*/
                        setObject: function(propName, value, context){
                                context = context || _g;
                                var parts = propName.split(".");        
                                var p = parts.pop();
                                for(var i=0, pn; context &&(pn = parts[i]); i++){
                                        context = (pn in context ? context[pn] : context[pn]={});
                                }
                                return (context && p ? (context[p]=value) : undefined);
                        },
                        /*invoke method with given scope*/
                        hitch : function(scope, method){
                                if(!method){
                                        method = scope;
                                        scope = null;
                                }
                                if(this.isString(method)){
                                        scope = scope || _g;
                                        if(!scope[method]){ throw(['hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
                                        return function(){ return scope[method].apply(scope, arguments || []); }; // Function
                                }
                                return !scope ? method : function(){ return method.apply(scope, arguments || []); };
                        },
                        /*used in building ajax data object from one form*/
                        _ajaxSetValue : function(obj, name, value){
                                if(value === null) return;
                                var val = obj[name];
                                if(this.isString(val)){
                                        obj[name] = [val, value];
                                }else if($.isArray(val)){
                                        obj[name].push(value);
                                }else{
                                        obj[name] = value;
                                }
                        },
                        /*used in building ajax data object from one form*/
                        _ajaxFieldValue : function(domNode){
                                var ret = null,
                                        type = (domNode.type||"").toLowerCase();
                                if(domNode.name && type && !domNode.disabled){
                                        if(type === "radio" || type === "checkbox"){
                                                        if(domNode.checked){ ret = domNode.value }
                                        }else if(domNode.multiple){
                                                ret = [];
                                                $("option",domNode).each(function(){
                                                        if(this.selected)
                                                                ret.push(this.value);
                                                });
                                        }else{
                                                ret = domNode.value;
                                        }
                                }
                                return ret;
                        },
                        _getForm: function(form){
                            var f = form;
                            if(this.isString(form)){
                                f = $("#"+form);
                                if(f.length ==0)
                                    f = $("form[name='" + form +"']");
                            }
                            return (f instanceof jQuery)? f.get(0):f;
                        },	
                        
                        /*used in building ajax data object from one form*/
                        _ajaxFormToObj : function (form){
                        	   form = this._getForm(form);
                               if(!form) return {};
                               var ret = {},_this = this,
           						exclude = "file|submit|image|reset|button|";
                                $.each(form.elements,function(i,e){
                                        var name = e.name,
                                        type = (e.type||"").toLowerCase();
                                        if(name && type && exclude.indexOf(type) === -1 && !e.disabled){
                                                _this._ajaxSetValue(ret, name, _this._ajaxFieldValue(e));
                                        }
                                });
                                return ret;
                        },
                        /*compose ajax call options*/
                        _ajaxOptions : function(url, data, args){
                                var options = {};
                                if(arguments.length === 1)
                                        options = url;
                                else{
                                        options = args || {};                                           
                                        options["url"] = url;
                                        if(data){
                                                if(this.isString(data)){
                                                        //data is a form id
                                                        $.extend(options, {data: this._ajaxFormToObj(data)});
                                                }else
                                                        $.extend(options,{data: data});
                                        }
                                }
                                //console.dir(options);
                                return options;
                        },
                        /*ajax call
                         * url ajax call url
                         * data data object or form id
                         * args other options*/
                        asyncXhr : function(url, data, args){                                                                           
                                $.ajax(this._ajaxOptions(url, data, args));
                        },
                        /*ajax call with GET type*/
                        asyncXhrGet : function(url, data, args){
                                var options = this._ajaxOptions(url, data, args);
                                options["type"] = "GET";
                                $.ajax(options);
                        },
                        /*ajax call with POST type*/
                        asyncXhrPost : function(url, data, args){
                                var options = this._ajaxOptions(url, data, args);
                                options["type"] = "POST";
                                $.ajax(options);
                        },                              
                        /*ajax sync call*/
                        syncXhr : function(url, data, args){
                                var _data, options = this._ajaxOptions(url, data, args);
                                $.extend(options,{
                                        async : false,
                                        success : function(data, textStatus){
                                                _data = data;
                                        },
                                        error : function(XMLHttpRequest, textStatus, errorThrown){
                                                _data = {};
                                                var exception = {};
                                                exception["message"] = "Error occurs when fetching data from url:" + this.url;
                                                exception["cause"] = textStatus? textStatus : errorThrown;
                                                _data["exception"] = exception;
                                        }
                                });
                                $.ajax(options);
                                //console.dir(_data);
                                return _data;
                        },
                        /*ajax sync call with GET type*/
                        syncXhrGet : function(url, data, args){
                                if(arguments.length === 1)
                                        url["type"] = "GET";
                                else{
                                        args = $.extend({},args,{type:"GET"});
                                }
                                return this.syncXhr(url, data, args);
                        },
                        /*ajax sync call with POST type*/
                        syncXhrPost : function(url, data, args){
                                if(arguments.length === 1)
                                        url["type"] = "POST";
                                else{
                                        args = $.extend({},args,{type:"POST"});
                                }
                                return this.syncXhr(url, data, args);
                        },
                       
                        /*open an new page*/
                        openPage : function(url, target, features, size){
                                target = target || "_blank";
                                features = features || this.windowFeatures;                                     
                                
                                if(size && size.length && size.length === 2){
                                        features = 'width=' + size[0] + ',height=' + size[1] + ',' + features;
                                }
                                
                                return window.open(this.encodeUrl(url) ,target,features);
                        },
                        
                        fixPng: function(context, contextPath){
                        	var ie55 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
                        	var ie6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);
                        	if(!$.browser.msie || !(ie55 || ie6)) return;
                        	context = context||document;                                               
                        	contextPath = contextPath || $(document.body).attr("root");
                        	
                        	$(context).find("img[src$=.png]").each(function() {
                        		$(this).attr('width',$(this).width());
                        		$(this).attr('height',$(this).height());			

                        		var prevStyle = '';
                        		var strNewHTML = '';
                        		var imgId = ($(this).attr('id')) ? ' id="' + $(this).attr('id') + '" ' : '';
                        		var imgClass = ($(this).attr('class')) ? ' class="' + $(this).attr('class') + '" ' : '';
                        		var imgTitle = ($(this).attr('title')) ? ' title="' + $(this).attr('title') + '" ' : '';
                        		var imgAlt = ($(this).attr('alt')) ? ' alt="' + $(this).attr('alt') + '" ' : '';
                        		var imgAlign = ($(this).attr('align')) ? 'float:' + $(this).attr('align') + ';' : '';
                        		var imgHand = ($(this).parent().attr('href')) ? 'cursor:hand;' : '';
                        		if (this.style.border) {
                        			prevStyle += 'border:'+this.style.border+';';
                        			this.style.border = '';
                        		}
                        		if (this.style.padding) {
                        			prevStyle += 'padding:'+this.style.padding+';';
                        			this.style.padding = '';
                        		}
                        		if (this.style.margin) {
                        			prevStyle += 'margin:'+this.style.margin+';';
                        			this.style.margin = '';
                        		}
                        		var imgStyle = (this.style.cssText);
                        		
                        		strNewHTML += '<img src="' + contextPath + '/images/transparent.gif"';
                        		if(imgId)
                        			strNewHTML += imgId;
                        		if(imgClass)
                        			strNewHTML += imgClass;
                        		if(imgTitle)
                        			strNewHTML += imgTitle;
                        		if(imgAlt)
                        			strNewHTML += imgAlt;
                        		strNewHTML += ' style="background:transparent;'+imgAlign+imgHand;
                        		strNewHTML += 'width:' + $(this).width() + 'px;' + 'height:' + $(this).height() + 'px;';
                        		strNewHTML += 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader' + '(src=\'' + $(this).attr('src') + '\', sizingMethod=\'scale\');';
                        		strNewHTML += imgStyle+'" />';

                        		$(this).after(strNewHTML);
                        		$(this).remove();
                        		
                        	});
                        }                       
                };                          
        }        
})(jQuery);