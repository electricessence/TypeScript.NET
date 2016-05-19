/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends=this&&this.__extends||function(e,o){function r(){this.constructor=e}for(var t in o)o.hasOwnProperty(t)&&(e[t]=o[t]);e.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)};define(["require","exports","./SubscribableBase"],function(e,o,r){"use strict";function t(e,o){for(var r=null,t=0,n=e;t<n.length;t++){var i=n[t];try{o(i)}catch(c){r=r||[],r.push({observer:i,ex:c})}}if(e.length=0,r&&r.length){if(!console||!console.error)throw{message:s,errors:r};console.error(s,r)}}var n=function(e){function o(){e.apply(this,arguments)}return __extends(o,e),o.prototype._onNext=function(e){t(this._getSubscribers(),function(o){o.onNext&&o.onNext(e)})},o.prototype._onError=function(e){t(this._getSubscribers(),function(o){o.onError&&o.onError(e)})},o.prototype._onCompleted=function(){t(this._unsubscribeAll(!0),function(e){e.onCompleted&&e.onCompleted()})},o}(r.SubscribableBase);o.ObservableBase=n;var s="One or more observers had errors when attempting to pass information.";Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=n});
//# sourceMappingURL=ObservableBase.js.map
