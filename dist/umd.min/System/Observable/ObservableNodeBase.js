/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)};!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./ObservableBase"],e)}(function(e,t){"use strict";var o=e("./ObservableBase"),n=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t.prototype.onNext=function(e){this._onNext(e)},t.prototype.onError=function(e){this._onError(e)},t.prototype.onCompleted=function(){this._onCompleted()},t}(o["default"]);t.ObservableNodeBase=n,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=ObservableNodeBase.js.map
