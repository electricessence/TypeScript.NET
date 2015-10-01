/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends=this&&this.__extends||function(o,e){function r(){this.constructor=o}for(var t in e)e.hasOwnProperty(t)&&(o[t]=e[t]);o.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)};define(["require","exports","./SubscribableBase"],function(o,e,r){function t(o,e,r){void 0===r&&(r=!0);for(var t=null,n=0;n<o.length;n++){var i=o[n];try{e(i)}catch(c){t=t||[],t.push({observer:i,ex:c})}}if(r&&(o.length=0),t&&t.length){if(!console||!console.error)throw{message:s,errors:t};console.error(s,t)}}var n=function(o){function e(){o.apply(this,arguments)}return __extends(e,o),e.prototype.onNext=function(o){t(this._getSubscribers(),function(e){e.onNext&&e.onNext(o)})},e.prototype.onError=function(o){t(this._getSubscribers(),function(e){e.onError&&e.onError(o)})},e.prototype.onCompleted=function(){t(this._unsubscribeAll(!0),function(o){o.onCompleted&&o.onCompleted()})},e}(r),s="One or more observers had errors when attempting to pass information.";return n});
//# sourceMappingURL=ObservableNodeBase.js.map
