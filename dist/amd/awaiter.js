/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(t,n){"use strict";function e(t,n,e,r){if(!e)throw"Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";return new e(function(i,o){function u(t){try{a(f.next(t))}catch(n){o(n)}}function c(t){try{a(f["throw"](t))}catch(n){o(n)}}function a(t){t.done?i(t.value):new e(function(n){n(t.value)}).then(u,c)}var f=r=r.apply(t,n);a(f.next())})}n.awaiter=e,function(t){function n(n){return function(e,r,i,o){t(e,r,i||n,o)}}t.factory=n}(e=n.awaiter||(n.awaiter={})),Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=e});
//# sourceMappingURL=awaiter.js.map