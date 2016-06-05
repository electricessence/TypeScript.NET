/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./TaskHandlerBase","../../Exceptions/ArgumentNullException","../../../extends"],function(e,t,n,o,i){"use strict";var s=i["default"],a=function(e){function t(t){if(e.call(this),this._action=t,!t)throw new o.ArgumentNullException("action")}return s(t,e),t.prototype._onExecute=function(){this._action()},t.prototype._onDispose=function(){e.prototype._onDispose.call(this),this._action=null},t}(n.TaskHandlerBase);t.TaskHandler=a,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a});
//# sourceMappingURL=TaskHandler.js.map
