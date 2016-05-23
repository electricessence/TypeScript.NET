/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","./ObjectDisposedException"],function(e,i,s){"use strict";var o=function(){function e(e){this.__finalizer=e,this.__wasDisposed=!1}return Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return this.__wasDisposed},enumerable:!0,configurable:!0}),e.prototype.throwIfDisposed=function(e,i){if(void 0===i&&(i=this._disposableObjectName),this.__wasDisposed)throw new s.ObjectDisposedException(i,e);return!0},e.prototype.dispose=function(){var e=this;if(!e.__wasDisposed){e.__wasDisposed=!0;try{e._onDispose()}finally{e.__finalizer&&(e.__finalizer(),e.__finalizer=void 0)}}},e.prototype._onDispose=function(){},e}();i.DisposableBase=o,Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=o});
//# sourceMappingURL=DisposableBase.js.map
