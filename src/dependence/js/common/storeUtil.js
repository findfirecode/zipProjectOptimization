/**
 * 格式化图片大小 see com.baozun.nebula.web.taglib.ImgUrlTag
 */
function formatImage(imgUrl, size) {
    if (null == imgUrl || undefined == imgUrl || "" == imgUrl) {
        return defaultImg;
    }

    var index_dot = imgUrl.lastIndexOf(".");
    var index_underline = imgUrl.lastIndexOf("_");

    var formatImgUrl = "";
    // 如果找到了下划线 "_",截取下划线及之前的部分
    if (index_underline != -1) {
        formatImgUrl = imgUrl.substring(0, index_underline);
    }
    // 如果找不到下划线 "_",截取.之前的部分
    else {
        formatImgUrl = imgUrl.substring(0, index_dot);
    }
    if ("source" != size) {
        formatImgUrl = formatImgUrl + "_";
        formatImgUrl = formatImgUrl + size;
    }
    formatImgUrl = formatImgUrl + imgUrl.substring(index_dot);
    return imgbase + formatImgUrl;
}

/**
 * 制保留2位小数，如：2，会在2后面补上00.即2.00
 */
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

/**
 * 制保留2位小数，如：2，会在2后面补上00.即2.00
 */
function toDecimal2Float(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    s = parseFloat(s).toLocaleString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}


/**
 * 注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架(封装了常用的Helper)
 * 
 * @param html
 * @returns
 */
function getHandlebarsTemplate(html) {
    // 注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架
    var handlebarsTemplate = Handlebars.compile(html);

    Handlebars.registerHelper({
        /**
         * 图片拼接,size参数是可选的
         */
        "imageUrlHelper" : function(imageUrl, size) {
            var returnUrl = "";
            if (null == size || "" == size || undefined == size || $.type(size) != "string") {
                returnUrl = imgbase + imageUrl;
            } else {
                returnUrl = formatImage(imageUrl, size);
            }
            console.log("returnUrl:%o", returnUrl);
            return returnUrl;
        },

        // 商品详细页面链接
        "hrefHelper" : function(itemCode) {
            return base + "/item/" + itemCode +".htm";
        },

        // 格式化金额
        "formatPriceHelper" : function(price) {
            return toDecimal2(price);
        },

        // 价格比较
        "priceCompareHelper" : function(finalPrice, listPrice, options) {
            if (finalPrice != listPrice) {
                return options.fn(this);// 满足添加继续执行
            }
            return options.inverse(this);// 不满足条件执行{{else}}部分
        },
        // 日期格式化
        "formatDateHelper" : function(date, pattern) {
            return moment(date).format(pattern);
        },

        // 一个判断字符串是否相等的方法equals
        "equals" : function(v1, v2, options) {// author :孙琛斌
            if (v1 == v2) {
                return options.fn(this);// 满足添加继续执行
            }
            return options.inverse(this);// 不满足条件执行{{else}}部分
        }
    });
    return handlebarsTemplate;
}

/**
 * 渲染 handlebarsTemplate
 * 
 * @param selector
 *                要渲染的选择器
 * @param data
 *                数据 数据格式 { "title" : "xxxx", "recommendationEngineCommandList" : xxxx }
 * 
 * @param template
 *                模板
 */
function renderTemplateHtmlToSelector(selector, data, template) {
    var html = template(data);
    console.log("selector:%o,html:%o", selector, html);
    // 将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
    $(selector).html(html);
}

/**
 * asyncXhrPost发送ajax请求到后端,得到数据,然后解析这些数据到handlebars模板
 * 
 * @param renderConfig
 */
function loadJsonjsonDataAndRenderTemplateHtmlToSelector(renderConfig) {
    // console.clear();
    console.log("renderConfig is:%o", renderConfig);

    // 没有必要使用同步 ,异步加载即可
    loxia.asyncXhrPost(renderConfig.url, renderConfig.params, {
        success : function(jsonData) {
            // 有数据才做事儿
            if (null != jsonData && "" != jsonData && !$.isEmptyObject(jsonData)) {
                console.log("return jsonData:%o", jsonData);

                var canRender = true;

                // 渲染handlebars数据之前 做了什么
                if ($.isFunction(renderConfig.beforeRenderjsonDataEvent)) {
                    canRender = renderConfig.beforeRenderjsonDataEvent(jsonData);
                }

                // 支持在 beforeRenderjsonDataEvent 返回是否可以渲染
                if (!canRender) {
                    return;
                }

                // 渲染
                var commentTemplate = getHandlebarsTemplate($(renderConfig.renderTemplateSelector).html());
                renderTemplateHtmlToSelector(renderConfig.renderToSelector, renderConfig.parseRenderjsonData(jsonData), commentTemplate);

                // 渲染handlebars数据之后 做点什么
                if ($.isFunction(renderConfig.afterRenderjsonDataEvent)) {
                    renderConfig.afterRenderjsonDataEvent(jsonData);
                }
            } else {
                console.warn("[%o] jsonData is null or empty,nothing to do!!!", renderConfig.renderToSelector);
            }
        }
    }, {
        error : function(jsonData) {
            console.log(jsonData);
        }
    });
}


/**
 * syncXhrPost发送ajax请求到后端,得到数据,然后解析这些数据到handlebars模板
 * 
 * @param renderConfig
 */
function loadJsonjsonDataAndRenderTemplateHtmlToSelectorSync(renderConfig) {
    // console.clear();
    console.log("renderConfig is:%o", renderConfig);

    // 使用同步
   var jsonData =  loxia.syncXhrPost(renderConfig.url, renderConfig.params);
    if(jsonData.isSuccess){
        // 有数据才做事儿
        if (null != jsonData && "" != jsonData && !$.isEmptyObject(jsonData)) {
            console.log("return jsonData:%o", jsonData);

            var canRender = true;

            // 渲染handlebars数据之前 做了什么
            if ($.isFunction(renderConfig.beforeRenderjsonDataEvent)) {
                canRender = renderConfig.beforeRenderjsonDataEvent(jsonData);
            }

            // 支持在 beforeRenderjsonDataEvent 返回是否可以渲染
            if (!canRender) {
                return;
            }
            // 渲染
            var commentTemplate = getHandlebarsTemplate($(renderConfig.renderTemplateSelector).html());
            renderTemplateHtmlToSelector(renderConfig.renderToSelector, renderConfig.parseRenderjsonData(jsonData), commentTemplate);

            // 渲染handlebars数据之后 做点什么
            if ($.isFunction(renderConfig.afterRenderjsonDataEvent)) {
                renderConfig.afterRenderjsonDataEvent(jsonData);
            }
        } else {
            console.warn("[%o] jsonData is null or empty,nothing to do!!!", renderConfig.renderToSelector);
        }
	}else{
		 console.log(jsonData);
	}
}

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1; 
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
return "";
}

// 封装lodash get方法
function get(obj, path, defaultValue) {
  var result = _.get(obj, path, defaultValue)
  return _.isNull(result) && defaultValue ?
    defaultValue :
    result
}
