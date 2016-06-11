/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Originally based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/parallel.js
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Promises/Promise","../../Types","../Worker","../deferImmediate","../../Environment","../../Disposable/ObjectPool"],e)}(function(e,r){"use strict";function n(e,r){r||(r={});for(var n=0,t=Object.keys(e);n<t.length;n++){var o=t[n];void 0===r[o]&&(r[o]=e[o])}return r}function t(e,r,n,t){r&&(e.onmessage=r),n&&(e.onerror=n),t!==l&&e.postMessage(t)}var o,i=e("../../Promises/Promise"),s=e("../../Types"),u=e("../Worker"),a=e("../deferImmediate"),c=e("../../Environment"),f=e("../../Disposable/ObjectPool"),l=void 0,p=typeof self!==s.Type.UNDEFINED?self.URL?self.URL:self.webkitURL:null,h=!(!c.isNodeJS&&!self.Worker),d={evalPath:c.isNodeJS?__dirname+"/eval.js":null,maxConcurrency:c.isNodeJS?e("os").cpus().length:navigator.hardwareConcurrency||4,allowSynchronous:!0,env:{},envNamespace:"env"},y=function(e){function r(r,n){e.call(this,function(e,o){t(r,function(r){e(r.data)},function(e){o(e)},n)},!0)}return __extends(r,e),r}(i.Promise);!function(e){function r(e){var r=i[e];return r||(i[e]=r=new f.ObjectPool(8),r.autoClearTimeout=1e3),r}function n(e){if(e){e.onerror=null,e.onmessage=null;var n=e.__key;n?r(n).add(e):a.deferImmediate(function(){return e.terminate()})}return null}function t(e){return r(e).tryTake()}function o(e,r){var n=new u["default"](r);return n.__key=e,n.dispose=function(){n.onmessage=null,n.onerror=null,n.dispose=null,n.terminate()},n}var i={};e.recycle=n,e.tryGet=t,e.getNew=o}(o||(o={}));var v=function(){function e(e){this.options=n(d,e),this._requiredScripts=[],this._requiredFunctions=[]}return e.maxConcurrency=function(r){return new e({maxConcurrency:r})},e.prototype.getWorkerSource=function(e,r){var n=this._requiredScripts,t=this._requiredFunctions,o="";!c.isNodeJS&&n.length&&(o+='importScripts("'+n.join('","')+'");\r\n');for(var i=0,s=t;i<s.length;i++){var u=s[i],a=u.name,f=u.fn,l=f.toString();o+=a?"var "+a+" = "+l+";":l}r=JSON.stringify(r||{});var p=this.options.envNamespace;return o+(c.isNodeJS?'process.on("message", function(e) {global.'+p+" = "+r+";process.send(JSON.stringify(("+e.toString()+")(JSON.parse(e).data)))})":"self.onmessage = function(e) {var global = {}; global."+p+" = "+r+"';self.postMessage(("+e.toString()+")(e.data))}")},e.prototype.require=function(){for(var e=[],r=0;r<arguments.length;r++)e[r-0]=arguments[r];return this.requireThese(e)},e.prototype.requireThese=function(e){for(var r=0,n=e;r<n.length;r++){var t=n[r];switch(typeof t){case s.Type.STRING:this._requiredScripts.push(t);break;case s.Type.FUNCTION:this._requiredFunctions.push({fn:t});break;case s.Type.OBJECT:this._requiredFunctions.push(t);break;default:throw new TypeError("Invalid type.")}}return this},e.prototype._spawnWorker=function(e,r){var n=this.getWorkerSource(e,r);if(u["default"]===l)return l;var t=o.tryGet(n);if(t)return t;var i=this._requiredScripts,s=this.options.evalPath;if(!s){if(c.isNodeJS)throw new Error("Can't use NodeJD without eval.js!");if(i.length)throw new Error("Can't use required scripts without eval.js!");if(!p)throw new Error("Can't create a blob URL in this browser!")}if(c.isNodeJS||i.length||!p)t=o.getNew(n,s),t.postMessage(n);else if(p){var a=new Blob([n],{type:"text/javascript"}),f=p.createObjectURL(a);t=o.getNew(n,f)}return t},e.prototype.startNew=function(e,r,t){var s=this,u=s._spawnWorker(r,n(s.options.env,t||{}));if(u)return new y(u,e).finallyThis(function(){return o.recycle(u)});if(s.options.allowSynchronous)return new i.Promise(function(n,t){try{n(r(e))}catch(o){t(o)}});throw new Error("Workers do not exist and synchronous operation not allowed!")},e.prototype.pipe=function(e,r,n){this.options.maxConcurrency;return new i.PromiseCollection(e&&e.map(function(e){return new i.Promise(function(e,r){})}))},e.prototype.map=function(e,r,n){var t=this;return e&&e.length?(e=e.slice(),new i.ArrayPromise(function(s,u){var a=[],c=e.length;a.length=c;for(var f,l=r.toString(),p=t.options.maxConcurrency,h=0,d=0,v=function(p){var v=t._spawnWorker(l,n);if(!v){if(!t.options.allowSynchronous)throw new Error("Workers do not exist and synchronous operation not allowed!");return s(i.Promise.all(e.map(function(e){return new i.Promise(function(n,t){try{n(r(e))}catch(o){t(o)}})}))),{value:void 0}}var m=function(){if(f&&(v=o.recycle(v)),v)if(c>h){var r=h++,n=new y(v,e[r]);n.thenSynchronous(function(e){a[r]=e,m()},function(e){f||(f=e,u(e),v=o.recycle(v))}).thenThis(function(){if(d++,d>c)throw Error("Resolved count exceeds data length.");d===c&&s(a)}).finallyThis(function(){return n.dispose()})}else v=o.recycle(v)};m()},m=0;!f&&h<Math.min(c,p);m++){var w=v(m);if("object"==typeof w)return w.value}})):i.ArrayPromise.fulfilled(e&&[])},Object.defineProperty(e,"isSupported",{get:function(){return h},enumerable:!0,configurable:!0}),e.options=function(r){return new e(r)},e.require=function(){for(var r=[],n=0;n<arguments.length;n++)r[n-0]=arguments[n];return(new e).requireThese(r)},e.requireThese=function(r){return(new e).requireThese(r)},e.startNew=function(r,n,t){return(new e).startNew(r,n,t)},e.map=function(r,n,t){return(new e).map(r,n,t)},e}();r.Parallel=v,Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=v});
//# sourceMappingURL=Parallel.js.map