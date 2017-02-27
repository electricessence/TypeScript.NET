/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var o=e(require,exports);void 0!==o&&(module.exports=o)}else"function"==typeof define&&define.amd&&define(["require","exports","../Environment"],e)}(function(e,o){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var r=e("../Environment");o.Worker=r.isNodeJS?e("./NodeJSWorker")["default"]:self.Worker,o["default"]=o.Worker});
//# sourceMappingURL=Worker.js.map