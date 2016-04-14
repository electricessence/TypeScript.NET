/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","../Collections/LinkedNodeList","../Disposable/Utility","./Subscription"],function(e,t,i,n,r){"use strict";var u=function(){function e(){this.__subscriptions=new i["default"]}return e.prototype._getSubscribers=function(){return this.__subscriptions.map(function(e){return e.value&&e.value.subscriber})},e.prototype._findEntryNode=function(e){return this.__subscriptions.find(function(t){return t.value.subscriber===e})},e.prototype.subscribe=function(e){var t=this,i=t._findEntryNode(e);if(i)return i.value;var n=new r["default"](t,e);return t.__subscriptions.addNode({value:n,previous:null,next:null}),n},e.prototype.unsubscribe=function(e){var t=this,i=t._findEntryNode(e);if(i){var n=i.value;t.__subscriptions.removeNode(i),n.dispose()}},e.prototype._unsubscribeAll=function(e){void 0===e&&(e=!1);var t=this,i=t.__subscriptions,r=i.map(function(e){return e.value}),u=e?r.map(function(e){return e.subscriber}):null;return i.clear(),n.disposeThese(r),u},e.prototype.unsubscribeAll=function(){this._unsubscribeAll()},e.prototype.dispose=function(){this._unsubscribeAll()},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u});
//# sourceMappingURL=SubscribableBase.js.map
