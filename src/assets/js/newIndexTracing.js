function initOmnitrueEvent() {
    //首页大小KV 图片点击
    $('.indexKvSwiperEvent').on('tap', '.swiper-slide img', function () {
        var url = $(this).parent().attr("href")
        url = getCodeFromUrl(url)
        var date = $(this).attr("uploaded_date");
        sendClickCode('pid','cn shop_home_kv_contents_image'+'_'+url+'_'+date);
    })

    //首页大小KV 圆点点击
    $('.swiperList').on('tap', 'div', function () {
        var className = $(this).attr('class')
        var index = parseInt($(this).attr("dot_index")) + 1
        if (className == 'action' || className == 'isaction') {
            sendClickCode('content_click_count','rolling:index_'+index);
        }
    })

    //首页banner图片点击
    $('#bannerImg ').on('tap', 'img', function () {
        var contents = $(this).parent().attr("href")
        contents = getCodeFromUrl(contents);
        var date = $(this).attr("uploaded_date");
        sendClickCode('pid','cn shop_home_contents_image_'+contents+'_'+date);
    })

    //热销推荐
    $('.t_jian').on('tap', '.hotItemEvent', function () {
        var code = getCodeFromUrl($(this).find("a").attr("href"))
        sendClickCode('finding_method', "shop_related products|;" + code + '|'+code);
    })

    //分类推荐 侧片banner
    $('.p_left').on('tap', 'div', function () {
        var contents = $(this).parent().attr("href")
        contents = getCodeFromUrl(contents);
        var date = $(this).attr("uploaded_date");
        sendClickCode('pid','cn shop_home_contents_image_'+contents+'_'+date);
    })

    //分类推荐 商品详情
    $('.p_right').on('tap', 'div', function () {
        var contents = $(this).find("a").attr("href")
        contents = getCodeFromUrl(contents);
        var name = $(this).parent().attr("category_name")
        sendClickCode('finding_method',"shop_"+name+"|" + contents + '|;' + contents);
    })

    // 悬浮按钮
    $('.floatingEvent').on('tap', 'ul li', function () {
        fcTrack("click", $(this).attr('button_name'))
    })

    // 活动banner
    $('.wearSwiperEvent').on('tap', 'a img', function () {
        var contents = getCodeFromUrl($(this).parent().attr("href"))
        var date = $(this).attr("uploaded_date");
        sendClickCode('pid','cn shop_home_contents_image_'+contents+'_'+date);
    })

    // 临时上线 ，head 后面取消
    $(".events-navbar-menu  .nav-pills>li>a").on('tap',function(){
        var code= $(this).attr('href').replace("/search","");
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

    // sendClickCode('gnb','shop_'+name+':'+text);
    // 分类推荐-分类点击
    $('.A_loc').on('tap', 'ul li', function () {
        var url = $(this).find("a").attr("href")
        if(url) {
            var contents = url.substring(url.lastIndexOf("search/")+7).split("/")
            if(contents.length >= 2) {
                sendClickCode('gnb','shop_'+contents[0]+':'+contents[1]);
            }
        }
    })
}

function getCodeFromUrl(url) {
    if(url.indexOf("/activity/") > -1) {
        return url.substring(url.lastIndexOf("/activity/")+10, url.length).replace(".htm","");
    }else if(url.indexOf("/item/") > -1) {
        return url.substring(url.lastIndexOf("/item/")+6, url.length).replace(".htm","");
    }else {
        return ''
    }
}
