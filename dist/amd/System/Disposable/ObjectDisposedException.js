/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","../Exceptions/InvalidOperationException"],function(t,e,n){"use strict";var o="ObjectDisposedException",i=function(t){function e(e,n,o){void 0===n&&(n=null),void 0===o&&(o=null),t.call(this,n,o,function(t){t.objectName=e})}return __extends(e,t),e.prototype.getName=function(){return o},e.prototype.toString=function(){var t=this,e=t.objectName;return e=e?"{"+e+"} ":"","["+t.name+": "+e+t.message+"]"},e.throwIfDisposed=function(t,n,o){if(t.wasDisposed)throw new e(n,o)},e}(n.InvalidOperationException);e.ObjectDisposedException=i,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=i});
//# sourceMappingURL=ObjectDisposedException.js.map
