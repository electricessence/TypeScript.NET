/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)};!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./TaskHandlerBase","../../Exceptions/ArgumentNullException"],e)}(function(e,t){"use strict";var o=e("./TaskHandlerBase"),n=e("../../Exceptions/ArgumentNullException"),i=function(e){function t(t){if(e.call(this),this._action=t,!t)throw new n.ArgumentNullException("action")}return __extends(t,e),t.prototype._onExecute=function(){this._action()},t.prototype._onDispose=function(){e.prototype._onDispose.call(this),this._action=null},t}(o.TaskHandlerBase);t.TaskHandler=i,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=i});
//# sourceMappingURL=TaskHandler.js.map
