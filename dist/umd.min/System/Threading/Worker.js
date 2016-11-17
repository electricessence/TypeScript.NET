/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
!function(e,o){if("object"==typeof module&&"object"==typeof module.exports){var r=o(require,exports);void 0!==r&&(module.exports=r)}else"function"==typeof define&&define.amd&&define(e,o)}(["require","exports","../Environment"],function(e,o){"use strict";var r=e("../Environment");o.Worker=r.isNodeJS?e("./NodeJSWorker")["default"]:self.Worker,Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=o.Worker});
//# sourceMappingURL=Worker.js.map