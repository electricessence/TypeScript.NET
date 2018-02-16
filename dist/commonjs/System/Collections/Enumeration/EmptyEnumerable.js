"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EmptyEnumerator_1 = require("./EmptyEnumerator");
var EmptyEnumerable = /** @class */ (function () {
    function EmptyEnumerable() {
        this.isEndless = false;
    }
    EmptyEnumerable.prototype.getEnumerator = function () {
        return EmptyEnumerator_1.EmptyEnumerator;
    };
    return EmptyEnumerable;
}());
exports.EmptyEnumerable = EmptyEnumerable;
//# sourceMappingURL=EmptyEnumerable.js.map