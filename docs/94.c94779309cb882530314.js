!function(){"use strict";var n="~";var t;t={ping:function(){return"pong"}},self.onmessage=function(e){var o=e.data;if(o instanceof Object&&"string"==typeof(null==o?void 0:o.queryAction)){var i=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n;return t.split(e)[0]}(o.queryAction);i in t?void 0!==(null==o?void 0:o.queryActionArguments)&&Promise.resolve().then((function(){return t[i].apply(self,o.queryActionArguments)})).then((function(n){!function(n,t){self.postMessage({queryActionListener:n,queryActionArguments:t})}(o.queryAction,n)})).catch((function(n){throw n})):console.warn("Unknown action: ".concat(i))}}}();