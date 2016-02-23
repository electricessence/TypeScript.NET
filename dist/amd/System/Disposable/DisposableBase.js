/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./ObjectDisposedException"],function(e,i,s){"use strict";var t=function(){function e(e){this._finalizer=e,this._wasDisposed=!1}return Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return this._wasDisposed},enumerable:!0,configurable:!0}),e.prototype.throwIfDisposed=function(e,i){if(void 0===i&&(i=this._disposableObjectName),this._wasDisposed)throw new s["default"](i,e);return!0},e.prototype.dispose=function(){var e=this;if(!e._wasDisposed){e._wasDisposed=!0;try{e._onDispose()}finally{e._finalizer&&e._finalizer()}}},e.prototype._onDispose=function(){},e}();Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=t});
//# sourceMappingURL=DisposableBase.js.map
