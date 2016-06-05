/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","./SubscribableBase","../../extends"],function(e,r,o,t){"use strict";function n(e,r){for(var o=null,t=0,n=e;t<n.length;t++){var s=n[t];try{r(s)}catch(i){o=o||[],o.push({observer:s,ex:i})}}if(e.length=0,o&&o.length){if(!console||!console.error)throw{message:u,errors:o};console.error(u,o)}}var s=t["default"],i=function(e){function r(){e.apply(this,arguments)}return s(r,e),r.prototype._onNext=function(e){n(this._getSubscribers(),function(r){r.onNext&&r.onNext(e)})},r.prototype._onError=function(e){n(this._getSubscribers(),function(r){r.onError&&r.onError(e)})},r.prototype._onCompleted=function(){n(this._unsubscribeAll(!0),function(e){e.onCompleted&&e.onCompleted()})},r}(o.SubscribableBase);r.ObservableBase=i;var u="One or more observers had errors when attempting to pass information.";Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=i});
//# sourceMappingURL=ObservableBase.js.map
