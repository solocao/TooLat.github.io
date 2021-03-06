(function(win) {
  var doc = win.document
  var docEl = doc.documentElement

  function refreshRem() {
    var width = docEl.getBoundingClientRect().width > docEl.clientWidth
      ? docEl.getBoundingClientRect().width : docEl.clientWidth
    var rem = width > 1500 ? width / 10 : width / 9
    docEl.style.fontSize = rem + 'px'
  }
  refreshRem()

  win.addEventListener('resize', refreshRem)

})(window);
