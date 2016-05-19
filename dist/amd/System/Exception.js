/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require","exports"],function(t,e){"use strict";var r="Exception",n=function(){function t(t,e,r){void 0===t&&(t=null),void 0===e&&(e=null),this.message=t;var n=this;n.name=n.getName(),n.data={},e&&(n.data.innerException=e),r&&r(n);try{var o=(new Error).stack;o=o&&o.replace(/^Error\n/,"").replace(/(.|\n)+\s+at new.+/,"")||"",this.stack=n.toStringWithoutBrackets()+o}catch(i){}Object.freeze(n)}return t.prototype.getName=function(){return r},t.prototype.toString=function(){return"["+this.toStringWithoutBrackets()+"]"},t.prototype.toStringWithoutBrackets=function(){var t=this,e=t.message;return t.name+(e?": "+e:"")},t.prototype.dispose=function(){var t=this.data;for(var e in t)t.hasOwnProperty(e)&&delete t[e]},t}();e.Exception=n,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n});
//# sourceMappingURL=Exception.js.map
