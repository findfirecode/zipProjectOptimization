!(function () {
    var target = this;
    var doc = window.document;
    var docEl = doc.documentElement;
    var newBase = 100;
    var dpr = 1; // 物理像素与逻辑像素的对应关系
    var scale = 1; // css像素缩放比率

    function setRem() {
        var visualView = Math.min(docEl.getBoundingClientRect().width, target.maxWidth); // visual viewport
        newBase = 100 * visualView / target.desinWidth;
        docEl.style.fontSize = newBase + 'px';
    }

    var tid;
    target.desinWidth = 720;
    target.baseFont = 16;
    target.maxWidth = 720;

    target.init = function () {
        window.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(setRem, 300);
            }
        }, false);
        if (doc.readyState === 'complete') {
            doc.body.style.fontSize = target.baseFont * dpr + 'px';
        } else {
            doc.addEventListener('DOMContentLoaded', function (e) {
                doc.body.style.fontSize = target.baseFont * dpr + 'px';
            }, false);
        }
        setRem();
        docEl.setAttribute('data-dpr', dpr);
    };
    target.init();
})();
