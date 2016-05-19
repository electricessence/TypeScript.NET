/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends=this&&this.__extends||function(t,e){function o(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)};define(["require","exports","./ObservableBase"],function(t,e,o){"use strict";var n=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e.prototype.onNext=function(t){this._onNext(t)},e.prototype.onError=function(t){this._onError(t)},e.prototype.onCompleted=function(){this._onCompleted()},e}(o["default"]);e.ObservableNodeBase=n,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n});
//# sourceMappingURL=ObservableNodeBase.js.map
