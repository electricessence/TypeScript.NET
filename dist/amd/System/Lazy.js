/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./ResolverBase","../extends"],function(e,t,r,u){"use strict";var a=u["default"],i=function(e){function t(t,r,u){void 0===r&&(r=!1),void 0===u&&(u=!1),e.call(this,t,r,u),this._disposableObjectName="Lazy",this._isValueCreated=!1}return a(t,e),Object.defineProperty(t.prototype,"isValueCreated",{get:function(){return!!this._isValueCreated},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"value",{get:function(){return this.getValue()},enumerable:!0,configurable:!0}),t.prototype.equals=function(e){return this==e},t.prototype.valueEquals=function(e){return this.equals(e)||this.value===e.value},t}(r.ResolverBase);t.Lazy=i;var n=function(e){function t(t,r){void 0===r&&(r=!1),e.call(this,t,r,!0)}return a(t,e),t}(i);t.ResettableLazy=n,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=Lazy.js.map
