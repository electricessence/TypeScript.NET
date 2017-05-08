/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports"],function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=function(){function e(e,r){if(this._subscribable=e,this._subscriber=r,!e||!r)throw"Subscribable and subscriber cannot be null."}return Object.defineProperty(e.prototype,"subscriber",{get:function(){return this._subscriber},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"wasDisposed",{get:function(){return!this._subscribable||!this._subscriber},enumerable:!0,configurable:!0}),e.prototype.dispose=function(){var e=this.subscriber,r=this._subscribable;this._subscribable=null;try{e&&r&&r.unsubscribe(e)}finally{this._subscriber=null}},e}();r.Subscription=s,r["default"]=s});
//# sourceMappingURL=Subscription.js.map