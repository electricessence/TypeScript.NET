/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e,o){if("object"==typeof module&&"object"==typeof module.exports){var i=o(require,exports);void 0!==i&&(module.exports=i)}else"function"==typeof define&&define.amd&&define(e,o)}(["require","exports","./Types"],function(e,o){function i(e,o,i){return void 0===i&&(i=!0),e===o||!i&&e==o||t(e)&&t(o)}function n(e,o,n){return void 0===n&&(n=!0),i(e,o,n)?0:e>o||n&&(0===e&&0==o||null===e&&void 0===o)?1:o>e||n&&(0===o&&0==e||null===o&&void 0===e)?-1:NaN}var r=e("./Types"),t=r["default"].isTrueNaN;o.areEqual=i,o.compare=n});
//# sourceMappingURL=Compare.js.map
