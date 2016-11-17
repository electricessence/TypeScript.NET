/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(t,e){if("object"==typeof module&&"object"==typeof module.exports){var n=e(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(t,e)}(["require","exports"],function(t,e){"use strict";function n(t,e,n,o){if(!n)throw"Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";return new n(function(r,i){function u(t){try{f(a.next(t))}catch(e){i(e)}}function c(t){try{f(a["throw"](t))}catch(e){i(e)}}function f(t){t.done?r(t.value):new n(function(e){e(t.value)}).then(u,c)}var a=o=o.apply(t,e);f(a.next())})}e.awaiter=n,function(t){function e(e){return function(n,o,r,i){t(n,o,r||e,i)}}t.factory=e}(n=e.awaiter||(e.awaiter={}))});
//# sourceMappingURL=awaiter.js.map