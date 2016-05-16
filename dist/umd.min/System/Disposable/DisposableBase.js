/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var o=e(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(["require","exports","./ObjectDisposedException"],e)}(function(e,o){"use strict";var t=e("./ObjectDisposedException"),i=function(){function e(e){this._finalizer=e,this._wasDisposed=!1}return Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return this._wasDisposed},enumerable:!0,configurable:!0}),e.prototype.throwIfDisposed=function(e,o){if(void 0===o&&(o=this._disposableObjectName),this._wasDisposed)throw new t["default"](o,e);return!0},e.prototype.dispose=function(){var e=this;if(!e._wasDisposed){e._wasDisposed=!0;try{e._onDispose()}finally{e._finalizer&&e._finalizer()}}},e.prototype._onDispose=function(){},e}();Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=i});
//# sourceMappingURL=DisposableBase.js.map
