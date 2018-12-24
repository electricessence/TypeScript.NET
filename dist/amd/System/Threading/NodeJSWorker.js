define(["require","exports","../Observable/ObservableBase","../../extends"],function(e,o,t,r){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var s=r["default"],n=e("child_process"),i=function(e){function o(o){var t=e.call(this)||this,r=t._process=n.fork(o);return r.on("message",function(e){return t._onNext(JSON.parse(e))}),r.on("error",function(e){return t._onError(e)}),t}return s(o,e),o.prototype._onNext=function(o){e.prototype._onNext.call(this,o),this.onmessage&&this.onmessage({data:o})},o.prototype._onError=function(o){e.prototype._onError.call(this,o),this.onerror&&this.onerror(o)},o.prototype._onDispose=function(){e.prototype._onDispose.call(this),this._process.removeAllListeners(),this._process.kill(),this._process=null},o.prototype.postMessage=function(e){this.throwIfDisposed(),this._process.send(JSON.stringify({data:e}))},o.prototype.terminate=function(){this.dispose()},o}(t.ObservableBase);o.NodeJSWorker=i,o["default"]=i});
//# sourceMappingURL=NodeJSWorker.js.map