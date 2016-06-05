/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require","exports","../Exceptions/InvalidOperationException","../../extends"],function(e,t,n,o){"use strict";var i=o["default"],r="ObjectDisposedException",c=function(e){function t(t,n,o){void 0===n&&(n=null),void 0===o&&(o=null),e.call(this,n,o,function(e){e.objectName=t})}return i(t,e),t.prototype.getName=function(){return r},t.prototype.toString=function(){var e=this,t=e.objectName;return t=t?"{"+t+"} ":"","["+e.name+": "+t+e.message+"]"},t.throwIfDisposed=function(e,n,o){if(e.wasDisposed)throw new t(n,o)},t}(n.InvalidOperationException);t.ObjectDisposedException=c,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=c});
//# sourceMappingURL=ObjectDisposedException.js.map
