/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)};define(["require","exports","./ResolverBase"],function(e,t,r){"use strict";var n=function(e){function t(t,r,n){void 0===r&&(r=!1),void 0===n&&(n=!1),e.call(this,t,r,n),this._disposableObjectName="Lazy",this._isValueCreated=!1}return __extends(t,e),Object.defineProperty(t.prototype,"isValueCreated",{get:function(){return!!this._isValueCreated},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"value",{get:function(){return this.getValue()},enumerable:!0,configurable:!0}),t.prototype.equals=function(e){return this==e},t.prototype.valueEquals=function(e){return this.equals(e)||this.value===e.value},t}(r.ResolverBase);t.Lazy=n,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=Lazy.js.map
