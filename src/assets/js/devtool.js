var isDevEnv = window.location.href.match(/https?:\/\/localhost/);

(function() {
    function addClearBtn() {
        var clearButton = document.createElement('div')
        document.body.appendChild(clearButton)
        clearButton.style = 'position:fixed;top:0;left:0;z-index: 100;'
        clearButton.innerHTML = '<button>清除</button>'
        clearButton.onclick = () => {
            delete localStorage.ptsDataCache
            window.location.reload()
        }
    }
    if(isDevEnv) {
        addClearBtn()
    }
})()
