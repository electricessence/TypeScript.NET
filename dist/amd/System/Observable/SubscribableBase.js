/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","../Collections/LinkedNodeList","../Disposable/dispose","./Subscription"],function(e,t,r,i,n){"use strict";var s=function(){function e(){this.__subscriptions=new r["default"]}return e.prototype._getSubscribers=function(){return this.__subscriptions.map(function(e){return e.value&&e.value.subscriber})},e.prototype._findEntryNode=function(e){return this.__subscriptions.find(function(t){return t.value.subscriber===e})},e.prototype.subscribe=function(e){var t=this,r=t._findEntryNode(e);if(r)return r.value;var i=new n["default"](t,e);return t.__subscriptions.addNode({value:i}),i},e.prototype.unsubscribe=function(e){var t=this,r=t._findEntryNode(e);if(r){var i=r.value;t.__subscriptions.removeNode(r),i.dispose()}},e.prototype._unsubscribeAll=function(e){void 0===e&&(e=!1);var t=this,r=t.__subscriptions,n=r.map(function(e){return e.value}),s=e?n.map(function(e){return e.subscriber}):null;return r.clear(),i["default"].these(n),s},e.prototype.unsubscribeAll=function(){this._unsubscribeAll()},e.prototype.dispose=function(){this._unsubscribeAll()},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=s});
//# sourceMappingURL=SubscribableBase.js.map
