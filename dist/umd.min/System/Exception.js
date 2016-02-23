/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}(function(e,t){"use strict";var o="Exception",n=function(){function e(e,t,o){void 0===e&&(e=null),void 0===t&&(t=null),this.message=e;var n=this;n.name=n.getName(),n.data={},t&&(n.data.innerException=t),o&&o(n),Object.freeze(n)}return e.prototype.getName=function(){return o},e.prototype.toString=function(){var e=this,t=e.message;return t=t?": "+t:"","["+e.name+t+"]"},e.prototype.dispose=function(){var e=this.data;for(var t in e)e.hasOwnProperty(t)&&delete e[t]},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=Exception.js.map
