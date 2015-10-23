/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,o){if("object"==typeof module&&"object"==typeof module.exports){var i=o(require,exports);void 0!==i&&(module.exports=i)}else"function"==typeof define&&define.amd&&define(e,o)}(["require","exports","./ObjectDisposedException"],function(e,o){var i=e("./ObjectDisposedException"),t=function(){function e(e){this._finalizer=e,this._wasDisposed=!1}return Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return this._wasDisposed},enumerable:!0,configurable:!0}),e.prototype.throwIfDisposed=function(e,o){if(void 0===o&&(o=this._disposableObjectName),this._wasDisposed)throw new i["default"](o,e);return!0},e.prototype.dispose=function(){var e=this;if(!e._wasDisposed){e._wasDisposed=!0;try{e._onDispose()}finally{e._finalizer&&e._finalizer()}}},e.prototype._onDispose=function(){},e}();Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=t});
//# sourceMappingURL=DisposableBase.js.map
