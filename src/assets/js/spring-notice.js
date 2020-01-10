$(function () {
//设置cookie
//name是cookie中的名，value是对应的值，iTime是多久过期（单位为天）
    function setCookie(name, value, iTime) {
//设置cookie过期时间
        var date = new Date();
        date.setTime(date.getTime() + iTime);
        document.cookie = name + "=" + value + "; path=/;expires = " + date.toGMTString();
    }

//获取cookie
    function getCookie(name) {
//cookie中的数据都是以分号加空格区分开
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].split("=")[0] == name) {
                return arr[i].split("=")[1];
            }
        }
//未找到对应的cookie则返回空字符串
        return '';
    }

//删除cookie
    function removeCookie(name) {
//调用setCookie方法，把时间设置为-1
        setCookie(name, 1, -1);
    }

//现在距离当天结束时间:毫秒
    function getExpireTime() {
        var date = new Date();
        var hour = 31 - date.getHours();
        var min = 60 - date.getMinutes();
        var ms = (3600 * hour + 60 * min) * 1000;
        return ms;
    }


    var note7Notice = $('.spring-notice');


// 判断是否勾选今天不显示
    var todayview = getCookie('todayview');

// removeCookie('todayview');

    if (todayview) {
        note7Notice.hide();
    } else {
        note7Notice.show();
    }

// 勾选今天不显示
    $('.icon-checked', note7Notice).on('tap', function () {
        var _this = $(this);
        _this.toggleClass('is-active');
    });

// 关闭公告
    $('.close', note7Notice).on('tap', function () {
        var _this = $(this),
            _thisParents = _this.parents('.footer');

// 设置cookie
        if ($('.icon-checked', _thisParents).hasClass('is-active')) {
            var ms = getExpireTime();
// console.log(ms);
            setCookie('todayview', 1, ms);
        }

// 删除公告
        note7Notice.fadeOut('slow', function () {
            note7Notice.remove();
        });

    });

    /*	//首页弹层按钮点击一天内不出现
    $(".go-buy").on("tap",function(){
    var ms = getExpireTime();
    setCookie('todayview', 1, ms);
    })
    $(".index-welcome-dialog-close").on("tap",function(){
    var ms = getExpireTime();
    setCookie('todayview', 1, ms);
    })*/
});

