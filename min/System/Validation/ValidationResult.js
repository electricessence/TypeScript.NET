/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(e,i){var n=new t(!0),t=function(){function e(e,i,n){void 0===e&&(e=!1),void 0===i&&(i=null),void 0===n&&(n=null),this.isValid=e,this.message=i,this.data=n,Object.freeze(this)}return e.prototype.equals=function(e){var i=this;return i.isValid===e.isValid&&i.message==i.message&&i.data==i.data},Object.defineProperty(e,"valid",{get:function(){return n},enumerable:!0,configurable:!0}),e.invalid=function(i,n){return void 0===n&&(n=null),new e(!1,i,n)},e}();return t});
//# sourceMappingURL=ValidationResult.js.map
