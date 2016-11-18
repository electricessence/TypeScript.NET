/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var n=t(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports"],function(e,t){"use strict";function n(e,t,n,o){if(!n)throw"Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";return new n(function(r,i){function u(e){try{f(a.next(e))}catch(t){i(t)}}function c(e){try{f(a["throw"](e))}catch(t){i(t)}}function f(e){e.done?r(e.value):new n(function(t){t(e.value)}).then(u,c)}var a=o=o.apply(e,t);f(a.next())})}t.awaiter=n,function(e){function t(t){return function(n,o,r,i){e(n,o,r||t,i)}}e.factory=t}(n=t.awaiter||(t.awaiter={})),Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=awaiter.js.map