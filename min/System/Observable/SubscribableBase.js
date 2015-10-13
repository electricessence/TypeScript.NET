/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","../Collections/LinkedList","../Disposable/Utility","./Subscription"],function(r,t,e,i,s){var n=function(){function r(){this.__subscriptions=new e["default"]}return r.prototype._getSubscribers=function(){return this.__subscriptions.toArray().map(function(r){return r.subscriber})},r.prototype._findEntryNode=function(r){for(var t=this.__subscriptions.first;t&&t.value.subscriber!==r;)t=t.next;return t},r.prototype.subscribe=function(r){var t=this,e=t._findEntryNode(r);if(e)return e.value;var i=new s["default"](t,r);return t.__subscriptions.add(i),i},r.prototype.unsubscribe=function(r){var t=this._findEntryNode(r);if(t){var e=t.value;t.remove(),e.dispose()}},r.prototype._unsubscribeAll=function(r){void 0===r&&(r=!1);var t=this,e=t.__subscriptions,s=e.toArray(),n=r?s.map(function(r){return r.subscriber}):null;return e.clear(),i.disposeThese(s),n},r.prototype.unsubscribeAll=function(){this._unsubscribeAll()},r.prototype.dispose=function(){this._unsubscribeAll()},r}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=SubscribableBase.js.map
