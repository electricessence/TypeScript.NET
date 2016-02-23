/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","../Collections/LinkedList","../Disposable/Utility","./Subscription"],function(t,r,e,i,s){"use strict";var n=function(){function t(){this.__subscriptions=new e["default"]}return t.prototype._getSubscribers=function(){return this.__subscriptions.toArray().map(function(t){return t.subscriber})},t.prototype._findEntryNode=function(t){for(var r=this.__subscriptions.first;r&&r.value.subscriber!==t;)r=r.next;return r},t.prototype.subscribe=function(t){var r=this,e=r._findEntryNode(t);if(e)return e.value;var i=new s["default"](r,t);return r.__subscriptions.add(i),i},t.prototype.unsubscribe=function(t){var r=this._findEntryNode(t);if(r){var e=r.value;r.remove(),e.dispose()}},t.prototype._unsubscribeAll=function(t){void 0===t&&(t=!1);var r=this,e=r.__subscriptions,s=e.toArray(),n=t?s.map(function(t){return t.subscriber}):null;return e.clear(),i.disposeThese(s),n},t.prototype.unsubscribeAll=function(){this._unsubscribeAll()},t.prototype.dispose=function(){this._unsubscribeAll()},t}();Object.defineProperty(r,"__esModule",{value:!0}),r["default"]=n});
//# sourceMappingURL=SubscribableBase.js.map
