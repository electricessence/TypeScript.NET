/*!
 * @author electricessence / https://github.com/electricessence/
 * Based on Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(t,e){"use strict";var n=function(){function t(){this._listeners=[]}return t.prototype.add=function(t){this._listeners.push(t)},t.prototype.remove=function(t){var e=this._listeners.indexOf(t);0>e||this._listeners.splice(e,1)},t.prototype.dispatch=function(){for(var t=[],e=0;e<arguments.length;e++)t[e-0]=arguments[e];for(var n=this._listeners,r=0,i=n;r<i.length;r++){var s=i[r];s.call(t)}},t.prototype.toMulticastFunction=function(){var t=this._listeners;return function(){for(var e=0,n=t;e<n.length;e++){var r=n[e];r.call(arguments)}}},t.prototype.dispose=function(){this._listeners.length=0},t}();Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n});
//# sourceMappingURL=EventSimple.js.map
