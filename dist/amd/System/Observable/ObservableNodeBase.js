/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","./ObservableBase","../../extends"],function(e,t,o,n){"use strict";var r=n["default"],i=function(e){function t(){e.apply(this,arguments)}return r(t,e),t.prototype.onNext=function(e){this._onNext(e)},t.prototype.onError=function(e){this._onError(e)},t.prototype.onCompleted=function(){this._onCompleted()},t}(o["default"]);t.ObservableNodeBase=i,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=ObservableNodeBase.js.map
