/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./TaskHandlerBase","../../Exceptions/ArgumentNullException","../../../extends"],e)}(function(e,t){"use strict";var o=e("./TaskHandlerBase"),n=e("../../Exceptions/ArgumentNullException"),i=e("../../../extends"),s=i["default"],r=function(e){function t(t){if(e.call(this),this._action=t,!t)throw new n.ArgumentNullException("action")}return s(t,e),t.prototype._onExecute=function(){this._action()},t.prototype._onDispose=function(){e.prototype._onDispose.call(this),this._action=null},t}(o.TaskHandlerBase);t.TaskHandler=r,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r});
//# sourceMappingURL=TaskHandler.js.map
