/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends=this&&this.__extends||function(e,o){function t(){this.constructor=e}for(var r in o)o.hasOwnProperty(r)&&(e[r]=o[r]);e.prototype=null===o?Object.create(o):(t.prototype=o.prototype,new t)};!function(e){if("object"==typeof module&&"object"==typeof module.exports){var o=e(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(["require","exports","./SubscribableBase"],e)}(function(e,o){"use strict";function t(e,o){for(var t=null,r=0,n=e;r<n.length;r++){var i=n[r];try{o(i)}catch(u){t=t||[],t.push({observer:i,ex:u})}}if(e.length=0,t&&t.length){if(!console||!console.error)throw{message:s,errors:t};console.error(s,t)}}var r=e("./SubscribableBase"),n=function(e){function o(){e.apply(this,arguments)}return __extends(o,e),o.prototype._onNext=function(e){t(this._getSubscribers(),function(o){o.onNext&&o.onNext(e)})},o.prototype._onError=function(e){t(this._getSubscribers(),function(o){o.onError&&o.onError(e)})},o.prototype._onCompleted=function(){t(this._unsubscribeAll(!0),function(e){e.onCompleted&&e.onCompleted()})},o}(r.SubscribableBase);o.ObservableBase=n;var s="One or more observers had errors when attempting to pass information.";Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=n});
//# sourceMappingURL=ObservableBase.js.map
