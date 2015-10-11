/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)};define(["require","exports","../Types","../Collections/Dictionaries/OrderedStringKeyDictionary","./QueryParams"],function(t,e,r,n,i){var o="&",s="=",u=function(t){function e(e,n){void 0===n&&(n=!0),t.call(this),r.isString(e)?this.importFromString(e,n):this.importMap(e)}return __extends(e,t),e.prototype.importFromString=function(t,e,r,n){var o=this;return void 0===e&&(e=!0),void 0===r&&(r=!0),void 0===n&&(n=!0),i.parse(t,function(t,e){o.setValue(t,e,n)},e,r),this},e.init=function(t,r){return void 0===r&&(r=!0),new e(t,r)},e.prototype.encode=function(t){for(var e=[],r=this.keys,n=0;n<r.length;n++){var u=r[n];e.push(u+s+i.encodeValue(this.getValue(u)))}return(e.length&&t?"?":"")+e.join(o)},e}(n);return u});
//# sourceMappingURL=QueryBuilder.js.map
