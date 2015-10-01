/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","../Collections/LinkedList","../Disposable/Utility","./Subscription"],function(r,t,i,n,s){var e=function(){function r(){this.__subscriptions=new i}return r.prototype._getSubscribers=function(){return this.__subscriptions.toArray().map(function(r){return r.subscriber})},r.prototype._findEntryNode=function(r){for(var t=this.__subscriptions.first;t&&t.value.subscriber!==r;)t=t.next;return t},r.prototype.subscribe=function(r){var t=this,i=t._findEntryNode(r);if(i)return i.value;var n=new s(t,r);return t.__subscriptions.add(n),n},r.prototype.unsubscribe=function(r){var t=this._findEntryNode(r);if(t){var i=t.value;t.remove(),i.dispose()}},r.prototype._unsubscribeAll=function(r){void 0===r&&(r=!1);var t=this,i=t.__subscriptions,s=i.toArray(),e=r?s.map(function(r){return r.subscriber}):null;return i.clear(),n.disposeThese(s),e},r.prototype.unsubscribeAll=function(){this._unsubscribeAll()},r.prototype.dispose=function(){this._unsubscribeAll()},r}();return e});
//# sourceMappingURL=SubscribableBase.js.map
