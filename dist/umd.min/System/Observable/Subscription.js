/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var r=e(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}(function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=function(){function e(e,r){if(this._subscribable=e,this._subscriber=r,!e||!r)throw"Subscribable and subscriber cannot be null."}return Object.defineProperty(e.prototype,"subscriber",{get:function(){return this._subscriber},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return!this._subscribable||!this._subscriber},enumerable:!0,configurable:!0}),e.prototype.dispose=function(){var e=this.subscriber,r=this._subscribable;this._subscribable=null;try{e&&r&&r.unsubscribe(e)}finally{this._subscriber=null}},e}();r.Subscription=t,r["default"]=t});
//# sourceMappingURL=Subscription.js.map