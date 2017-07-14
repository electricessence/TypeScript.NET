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
        define(["require", "exports", "../source/System/Promises/Promise", "stream-to-promise-agnostic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise_1 = require("../source/System/Promises/Promise");
    var stream_to_promise_agnostic_1 = require("stream-to-promise-agnostic");
    exports.streamToPromise = stream_to_promise_agnostic_1.streamToPromise(Promise_1.TSDNPromise.factory);
    exports.default = exports.streamToPromise;
});
//# sourceMappingURL=stream-to-promise.js.map