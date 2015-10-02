/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(s,e){var i=function(){function s(s){this._finalizer=s,this._wasDisposed=!1}return Object.defineProperty(s.prototype,"wasDisposed",{get:function(){return this._wasDisposed},enumerable:!0,configurable:!0}),s.assertIsNotDisposed=function(s,e){if(void 0===e&&(e="ObjectDisposedException"),s)throw new Error(e);return!0},s.prototype.assertIsNotDisposed=function(e){return void 0===e&&(e="ObjectDisposedException"),s.assertIsNotDisposed(this._wasDisposed,e)},s.prototype.dispose=function(){var s=this;if(!s._wasDisposed){s._wasDisposed=!0;try{s._onDispose()}finally{s._finalizer&&s._finalizer()}}},s.prototype._onDispose=function(){},s}();return i});
//# sourceMappingURL=DisposableBase.js.map
