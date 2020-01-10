/***保存O2O活动扫码进入首页的店铺code**/
var autoSaveO2OShopCodeUrl = base + "/autoSaveO2OShopCode.json";

$(function () {
    /***处理O2OshopCode存session begin*/
    if (!isBlank(window.location.search) && window.location.search.indexOf('shopID') != -1) {
        var shopCode = window.location.search.replace("?shopID=", "");
        if (isBlank(shopCode)) {
            return;
        }
        loxia.asyncXhrPost(loxia.encodeUrl(autoSaveO2OShopCodeUrl), {
            "shopCode": shopCode
        }, {
            success: function (data) {
                if (data.isSuccess) {
                    $('#needSFlag').val(data.description);
                    console.log("save shopCode success");
                } else {
                    console.log("save shopCode error," + data.description);
                }

            }
        }, {
            error: function (data) {
                console.log(data);
            }
        });
    }
    /***处理O2OshopCode存session end*/
});
