/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(t){if("object"==typeof module&&"object"==typeof module.exports){var e=t(require,exports);void 0!==e&&(module.exports=e)}else"function"==typeof define&&define.amd&&define(["require","exports"],t)}(function(t,e){"use strict";var r="Exception",o=function(){function t(t,e,r){void 0===t&&(t=null),void 0===e&&(e=null),this.message=t;var o=this;o.name=o.getName(),o.data={},e&&(o.data.innerException=e),r&&r(o);try{var n=(new Error).stack;n=n&&n.replace(/^Error\n/,"").replace(/(.|\n)+\s+at new.+/,"")||"",this.stack=o.toStringWithoutBrackets()+n}catch(i){}Object.freeze(o)}return t.prototype.getName=function(){return r},t.prototype.toString=function(){return"["+this.toStringWithoutBrackets()+"]"},t.prototype.toStringWithoutBrackets=function(){var t=this,e=t.message;return t.name+(e?": "+e:"")},t.prototype.dispose=function(){var t=this.data;for(var e in t)t.hasOwnProperty(e)&&delete t[e]},t}();e.Exception=o,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o});
//# sourceMappingURL=Exception.js.map
