/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,t){if("object"==typeof module&&"object"==typeof module.exports){var n=t(require,exports);void 0!==n&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(e,t)}(["require","exports","./Types","./Exceptions/ArgumentException"],function(e,t){function n(e){return 0|e}var n,o=e("./Types"),r=e("./Exceptions/ArgumentException");!function(e){function t(e){return Math.random()*e|0}function n(e){return o["default"].isNumber(e,!1)&&e==(0|e)}function u(e,t){var o=n(e);if(!o)throw new r["default"](t||"n","Must be an integer.");return o}e.random=t,e.is=n,e.assert=u}(n||(n={})),Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n});
//# sourceMappingURL=Integer.js.map
