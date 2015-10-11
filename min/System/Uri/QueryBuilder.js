/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","../Types","../Collections/Dictionaries/OrderedStringKeyDictionary","./QueryParams"],function(t,e,n,r,i){var o="&",s="=",u=function(t){function e(e,r){void 0===r&&(r=!0),t.call(this),n.isString(e)?this.importFromString(e,r):this.importMap(e)}return __extends(e,t),e.prototype.importFromString=function(t,e,n,r){var o=this;return void 0===e&&(e=!0),void 0===n&&(n=!0),void 0===r&&(r=!0),i.parse(t,function(t,e){o.setValue(t,e,r)},e,n),this},e.init=function(t,n){return void 0===n&&(n=!0),new e(t,n)},e.prototype.encode=function(t){for(var e=[],n=this.keys,r=0;r<n.length;r++){var u=n[r];e.push(u+s+i.encodeValue(this.getValue(u)))}return(e.length&&t?"?":"")+e.join(o)},e.prototype.toString=function(){return this.encode()},e}(r);return u});
//# sourceMappingURL=QueryBuilder.js.map
