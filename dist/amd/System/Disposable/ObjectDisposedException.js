/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require","exports","../Exceptions/InvalidOperationException","../../extends"],function(e,t,n,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=o["default"],r="ObjectDisposedException",s=function(e){function t(t,n,o){return e.call(this,n||"",o,function(e){e.objectName=t})||this}return i(t,e),t.prototype.getName=function(){return r},t.prototype.toString=function(){var e=this,t=e.objectName;return t=t?"{"+t+"} ":"","["+e.name+": "+t+e.message+"]"},t.throwIfDisposed=function(e,n,o){if(e.wasDisposed)throw new t(n,o);return!0},t}(n.InvalidOperationException);t.ObjectDisposedException=s,t["default"]=s});
//# sourceMappingURL=ObjectDisposedException.js.map