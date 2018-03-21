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
        define(["require", "exports", "stream-to-promise-agnostic", "../source/System/Promises/Functions/create"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var stream_to_promise_agnostic_1 = require("stream-to-promise-agnostic");
    var create_1 = require("../source/System/Promises/Functions/create");
    exports.streamToPromise = stream_to_promise_agnostic_1.streamToPromise(create_1.default);
    exports.default = exports.streamToPromise;
});
//# sourceMappingURL=stream-to-promise.js.map