/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
define(["require","exports","../Collections/LinkedNodeList","../Disposable/dispose","./Subscription"],function(e,i,s,t,r){"use strict";var n=function(){function e(){this.__subscriptions=new s.LinkedNodeList}return e.prototype._getSubscribers=function(){return this.__subscriptions.map(function(e){return e.value&&e.value.subscriber})},e.prototype._findEntryNode=function(e){return this.__subscriptions.find(function(i){return i.value.subscriber===e})},e.prototype.subscribe=function(e){var i=this,s=i._findEntryNode(e);if(s)return s.value;var t=new r.Subscription(i,e);return i.__subscriptions.addNode({value:t}),t},e.prototype.unsubscribe=function(e){var i=this,s=i._findEntryNode(e);if(s){var t=s.value;i.__subscriptions.removeNode(s),t.dispose()}},e.prototype._unsubscribeAll=function(e){void 0===e&&(e=!1);var i=this,s=i.__subscriptions,r=s.map(function(e){return e.value}),n=e?r.map(function(e){return e.subscriber}):null;return s.clear(),t.dispose.these(r),n},e.prototype.unsubscribeAll=function(){this._unsubscribeAll()},e.prototype.dispose=function(){this._unsubscribeAll()},e}();i.SubscribableBase=n,Object.defineProperty(i,"__esModule",{value:!0}),i["default"]=n});
//# sourceMappingURL=SubscribableBase.js.map
