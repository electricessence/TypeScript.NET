/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Environment"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Environment_1 = require("../Environment");
    exports.Worker = Environment_1.isNodeJS ? require('./NodeJSWorker').default : self.Worker;
    exports.default = exports.Worker;
});
//# sourceMappingURL=Worker.js.map