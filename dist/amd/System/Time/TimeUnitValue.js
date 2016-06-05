/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./TimeUnit","./TimeQuantity","../../extends"],function(t,e,i,n,o){"use strict";function u(t,e){return i.TimeUnit.fromMilliseconds(t.getTotalMilliseconds(),e)}var r=o["default"],s=function(t){function e(e,n){t.call(this,"number"==typeof e?e:u(e,n)),this._units=n,i.TimeUnit.assertValid(n)}return r(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return this._quantity},set:function(t){this._total=null,this._quantity=t},enumerable:!0,configurable:!0}),e.prototype.getTotalMilliseconds=function(){return i.TimeUnit.toMilliseconds(this._quantity,this._units)},Object.defineProperty(e.prototype,"units",{get:function(){return this._units},enumerable:!0,configurable:!0}),e.prototype.to=function(t){return void 0===t&&(t=this.units),e.from(this,t)},e.from=function(t,n){return void 0===n&&(n=i.TimeUnit.Milliseconds),new e(t,n)},e}(n.TimeQuantity);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=s});
//# sourceMappingURL=TimeUnitValue.js.map
