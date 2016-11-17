/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var o=t(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","./ObservableBase","../../extends"],function(e,t){"use strict";var o=e("./ObservableBase"),n=e("../../extends"),r=n["default"],i=function(e){function t(){return e.apply(this,arguments)||this}return r(t,e),t.prototype.onNext=function(e){this._onNext(e)},t.prototype.onError=function(e){this._onError(e)},t.prototype.onCompleted=function(){this._onCompleted()},t}(o["default"]);t.ObservableNodeBase=i,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=ObservableNodeBase.js.map