/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","./ObservableBase","../../extends"],function(e,t,o,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n["default"],u=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return r(t,e),t.prototype.onNext=function(e){this._onNext(e)},t.prototype.onError=function(e){this._onError(e)},t.prototype.onCompleted=function(){this._onCompleted()},t}(o["default"]);t.ObservableNodeBase=u,t["default"]=u});
//# sourceMappingURL=ObservableNodeBase.js.map