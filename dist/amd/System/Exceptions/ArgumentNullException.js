/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require","exports","./ArgumentException","../../extends"],function(e,t,n,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=u["default"],i="ArgumentNullException",o=function(e){function t(t,n,u){return void 0===n&&(n="'"+t+"' is null (or undefined)."),e.call(this,t,n,u)||this}return r(t,e),t.prototype.getName=function(){return i},t}(n.ArgumentException);t.ArgumentNullException=o,t["default"]=o});
//# sourceMappingURL=ArgumentNullException.js.map