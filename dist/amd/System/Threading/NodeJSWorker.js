/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon Parallel.js: https://github.com/adambom/parallel.js/blob/master/lib/Worker.js
 */
define(["require","exports","../Observable/ObservableBase"],function(e,o,t){"use strict";var s=e("child_process"),r=function(e){function o(o){var t=this;e.call(this);var r=this._process=s.fork(o);r.on("message",function(e){return t._onNext(JSON.parse(e))}),r.on("error",function(e){return t._onError(e)})}return __extends(o,e),o.prototype._onNext=function(o){e.prototype._onNext.call(this,o),this.onmessage&&this.onmessage({data:o})},o.prototype._onError=function(o){e.prototype._onError.call(this,o),this.onerror&&this.onerror(o)},o.prototype._onDispose=function(){e.prototype._onDispose.call(this),this._process.removeAllListeners(),this._process.kill(),this._process=null},o.prototype.postMessage=function(e){this.throwIfDisposed(),this._process.send(JSON.stringify({data:e}))},o.prototype.terminate=function(){this.dispose()},o}(t.ObservableBase);o.NodeJSWorker=r,Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=r});
//# sourceMappingURL=NodeJSWorker.js.map
