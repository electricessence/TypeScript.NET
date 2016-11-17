/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(t,n){"use strict";function r(t,n,r,e){if(!r)throw"Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";return new r(function(i,o){function c(t){try{a(f.next(t))}catch(n){o(n)}}function u(t){try{a(f["throw"](t))}catch(n){o(n)}}function a(t){t.done?i(t.value):new r(function(n){n(t.value)}).then(c,u)}var f=e=e.apply(t,n);a(f.next())})}n.awaiter=r,function(t){function n(n){return function(r,e,i,o){t(r,e,i||n,o)}}t.factory=n}(r=n.awaiter||(n.awaiter={}))});
//# sourceMappingURL=awaiter.js.map