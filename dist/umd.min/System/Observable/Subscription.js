/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
!function(e,r){if("object"==typeof module&&"object"==typeof module.exports){var t=r(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(e,r)}(["require","exports"],function(e,r){var t=function(){function e(e,r){if(this._subscribable=e,this._subscriber=r,!e||!r)throw"Subscribable and subscriber cannot be null."}return Object.defineProperty(e.prototype,"subscriber",{get:function(){return this._subscriber},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return!this._subscribable||!this._subscriber},enumerable:!0,configurable:!0}),e.prototype.dispose=function(){var e=this.subscriber,r=this._subscribable;this._subscriber=null,this._subscribable=null,e&&r&&r.unsubscribe(e)},e}();Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=t});
//# sourceMappingURL=Subscription.js.map
