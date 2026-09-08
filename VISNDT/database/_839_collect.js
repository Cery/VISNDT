window.__errs = window.__errs || [];
window.addEventListener("error", function (e) { window.__errs.push("ERR:" + (e.message || e.type)); });
(function () {
  var ce = window.console.error;
  window.console.error = function () {
    window.__errs.push("CONSOLE:" + Array.prototype.map.call(arguments, String).join(" "));
    return ce.apply(window.console, arguments);
  };
})();
JSON.stringify({ inited: true, errs: window.__errs.length });