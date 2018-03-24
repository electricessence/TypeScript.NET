/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./IteratorResult", "../../Functions"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IteratorResult_1 = require("./IteratorResult");
    var Functions_1 = require("../../Functions");
    var VOID0 = void 0;
    /**
     * A simplified stripped down enumerable that is always complete and has no results.
     * Frozen and exported as 'empty' to allow for reuse.
     */
    var EmptyEnumerator = Object.freeze({
        current: VOID0,
        moveNext: Functions_1.default.False,
        tryMoveNext: Functions_1.default.False,
        nextValue: Functions_1.default.Blank,
        next: IteratorResult_1.default.getDone,
        "return": IteratorResult_1.default.getDone,
        end: Functions_1.default.Blank,
        reset: Functions_1.default.Blank,
        dispose: Functions_1.default.Blank,
        isEndless: false
    });
    exports.default = EmptyEnumerator;
});
//# sourceMappingURL=EmptyEnumerator.js.map