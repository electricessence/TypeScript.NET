/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","../../extends"],e)}(function(e,t){"use strict";var n=e("../../extends"),o=(n["default"],function(){function e(){this._listeners=[]}return e.prototype.add=function(e){this._listeners.push(e)},e.prototype.remove=function(e){var t=this._listeners.indexOf(e);0>t||this._listeners.splice(t,1)},e.prototype.dispatch=function(){for(var e=[],t=0;t<arguments.length;t++)e[t-0]=arguments[t];for(var n=this._listeners,o=0,i=n;o<i.length;o++){var r=i[o];r.call(e)}},e.prototype.toMulticastFunction=function(){var e=this._listeners;return function(){for(var t=0,n=e;t<n.length;t++){var o=n[t];o.call(arguments)}}},e.prototype.dispose=function(){this._listeners.length=0},e}());Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=o});
//# sourceMappingURL=EventSimple.js.map
