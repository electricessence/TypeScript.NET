/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var o=e(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(["require","exports","./SubscribableBase","../../extends"],e)}(function(e,o){"use strict";function r(e,o){for(var r=null,t=0,n=e;t<n.length;t++){var s=n[t];try{o(s)}catch(i){r=r||[],r.push({observer:s,ex:i})}}if(e.length=0,r&&r.length){if(!console||!console.error)throw{message:u,errors:r};console.error(u,r)}}var t=e("./SubscribableBase"),n=e("../../extends"),s=n["default"],i=function(e){function o(){e.apply(this,arguments)}return s(o,e),o.prototype._onNext=function(e){r(this._getSubscribers(),function(o){o.onNext&&o.onNext(e)})},o.prototype._onError=function(e){r(this._getSubscribers(),function(o){o.onError&&o.onError(e)})},o.prototype._onCompleted=function(){r(this._unsubscribeAll(!0),function(e){e.onCompleted&&e.onCompleted()})},o}(t.SubscribableBase);o.ObservableBase=i;var u="One or more observers had errors when attempting to pass information.";Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=i});
//# sourceMappingURL=ObservableBase.js.map
