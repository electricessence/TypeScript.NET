/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var o=e(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(["require","exports","./ObjectDisposedException"],e)}(function(e,o){"use strict";var i=e("./ObjectDisposedException"),t=function(){function e(e){this.__finalizer=e,this.__wasDisposed=!1}return Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return this.__wasDisposed},enumerable:!0,configurable:!0}),e.prototype.throwIfDisposed=function(e,o){if(void 0===o&&(o=this._disposableObjectName),this.__wasDisposed)throw new i.ObjectDisposedException(o,e);return!0},e.prototype.dispose=function(){var e=this;if(!e.__wasDisposed){e.__wasDisposed=!0;try{e._onDispose()}finally{e.__finalizer&&(e.__finalizer(),e.__finalizer=void 0)}}},e.prototype._onDispose=function(){},e}();o.DisposableBase=t,Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=t});
//# sourceMappingURL=DisposableBase.js.map
