/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};define(["require","exports","../Exceptions/ArgumentNullException","./ReadOnlyCollectionBase"],function(t,e,n,o){"use strict";var r=function(t){function e(e){if(t.call(this),!e)throw new n.ArgumentNullException("collection");var o=this;o._getCount=function(){return e.count},o.getEnumerator=function(){return e.getEnumerator()}}return __extends(e,t),e}(o.ReadOnlyCollectionBase);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=r});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map
