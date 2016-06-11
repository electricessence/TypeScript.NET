/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./IteratorResult", "../../Functions"], factory);
    }
})(function (require, exports) {
    "use strict";
    var IteratorResult_1 = require("./IteratorResult");
    var Functions_1 = require("../../Functions");
    var VOID0 = void 0;
    exports.EmptyEnumerator = Object.freeze({
        current: VOID0,
        moveNext: Functions_1.Functions.False,
        nextValue: Functions_1.Functions.Blank,
        next: IteratorResult_1.IteratorResult.GetDone,
        "return": IteratorResult_1.IteratorResult.GetDone,
        reset: Functions_1.Functions.Blank,
        dispose: Functions_1.Functions.Blank,
        isEndless: false
    });
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports.EmptyEnumerator;
});
//# sourceMappingURL=EmptyEnumerator.js.map