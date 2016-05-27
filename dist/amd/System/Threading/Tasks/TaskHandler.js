/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","./TaskHandlerBase","../../Exceptions/ArgumentNullException"],function(t,e,n,o){"use strict";var i=function(t){function e(e){if(t.call(this),this._action=e,!e)throw new o.ArgumentNullException("action")}return __extends(e,t),e.prototype._onExecute=function(){this._action()},e.prototype._onDispose=function(){t.prototype._onDispose.call(this),this._action=null},e}(n.TaskHandlerBase);e.TaskHandler=i,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=i});
//# sourceMappingURL=TaskHandler.js.map
