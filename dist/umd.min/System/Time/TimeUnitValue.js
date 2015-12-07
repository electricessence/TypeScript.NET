/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};!function(t,e){if("object"==typeof module&&"object"==typeof module.exports){var n=e(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(t,e)}(["require","exports","./TimeUnit","./TimeQuantity"],function(t,e){function n(t,e){return i["default"].fromMilliseconds(t.getTotalMilliseconds(),e)}var i=t("./TimeUnit"),o=t("./TimeQuantity"),r=function(t){function e(e,o){t.call(this,"number"==typeof e?e:n(e,o)),this._units=o,i["default"].assertValid(o)}return __extends(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return this._quantity},set:function(t){this._total=null,this._quantity=t},enumerable:!0,configurable:!0}),e.prototype.getTotalMilliseconds=function(){return i["default"].toMilliseconds(this._quantity,this._units)},Object.defineProperty(e.prototype,"units",{get:function(){return this._units},enumerable:!0,configurable:!0}),e.prototype.to=function(t){return void 0===t&&(t=this.units),e.from(this,t)},e.from=function(t,n){return void 0===n&&(n=i["default"].Milliseconds),new e(t,n)},e}(o["default"]);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=r});
//# sourceMappingURL=TimeUnitValue.js.map
