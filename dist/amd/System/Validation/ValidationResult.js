/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(e,i){"use strict";var t=new n(!0),n=function(){function e(e,i,t){void 0===e&&(e=!1),void 0===i&&(i=null),void 0===t&&(t=null),this.isValid=e,this.message=i,this.data=t,Object.freeze(this)}return e.prototype.equals=function(e){var i=this;return i.isValid===e.isValid&&i.message==i.message&&i.data==i.data},Object.defineProperty(e,"valid",{get:function(){return t},enumerable:!0,configurable:!0}),e.invalid=function(i,t){return void 0===t&&(t=null),new e(!1,i,t)},e}();Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=n});
//# sourceMappingURL=ValidationResult.js.map
