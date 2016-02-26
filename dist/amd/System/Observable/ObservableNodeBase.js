/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends=this&&this.__extends||function(e,t){function o(){this.constructor=e}for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)};define(["require","exports","./SubscribableBase"],function(e,t,o){"use strict";function r(e,t){for(var o=null,r=0,n=e;r<n.length;r++){var i=n[r];try{t(i)}catch(u){o=o||[],o.push({observer:i,ex:u})}}if(e.length=0,o&&o.length){if(!console||!console.error)throw{message:s,errors:o};console.error(s,o)}}var n=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t.prototype.onNext=function(e){r(this._getSubscribers(),function(t){t.onNext&&t.onNext(e)})},t.prototype.onError=function(e){r(this._getSubscribers(),function(t){t.onError&&t.onError(e)})},t.prototype.onCompleted=function(){r(this._unsubscribeAll(!0),function(e){e.onCompleted&&e.onCompleted()})},t}(o["default"]);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n;var s="One or more observers had errors when attempting to pass information."});
//# sourceMappingURL=ObservableNodeBase.js.map
