"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var IteratorResult_1 = require("./IteratorResult");
var Functions_1 = require("../../Functions");
var VOID0 = void 0;
/**
 * A simplified stripped down enumerable that is always complete and has no results.
 * Frozen and exported as 'empty' to allow for reuse.
 */
exports.EmptyEnumerator = Object.freeze({
    current: VOID0,
    moveNext: Functions_1.Functions.False,
    tryMoveNext: Functions_1.Functions.False,
    nextValue: Functions_1.Functions.Blank,
    next: IteratorResult_1.IteratorResult.GetDone,
    "return": IteratorResult_1.IteratorResult.GetDone,
    end: Functions_1.Functions.Blank,
    reset: Functions_1.Functions.Blank,
    dispose: Functions_1.Functions.Blank,
    isEndless: false
});
exports.default = exports.EmptyEnumerator;
//# sourceMappingURL=EmptyEnumerator.js.map