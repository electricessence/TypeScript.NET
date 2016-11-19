/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports"],function(t,e){"use strict";function n(t,e,n,r){if(!n)throw"Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";return new n(function(i,o){function u(t){try{a(f.next(t))}catch(e){o(e)}}function c(t){try{a(f["throw"](t))}catch(e){o(e)}}function a(t){t.done?i(t.value):new n(function(e){e(t.value)}).then(u,c)}var f=r=r.apply(t,e);a(f.next())})}e.awaiter=n,Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n});
//# sourceMappingURL=awaiter.js.map