/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}(function(e,t){"use strict";var i=new n(!0),n=function(){function e(e,t,i){void 0===e&&(e=!1),void 0===t&&(t=null),void 0===i&&(i=null),this.isValid=e,this.message=t,this.data=i,Object.freeze(this)}return e.prototype.equals=function(e){var t=this;return t.isValid===e.isValid&&t.message==t.message&&t.data==t.data},Object.defineProperty(e,"valid",{get:function(){return i},enumerable:!0,configurable:!0}),e.invalid=function(t,i){return void 0===i&&(i=null),new e(!1,t,i)},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=ValidationResult.js.map
