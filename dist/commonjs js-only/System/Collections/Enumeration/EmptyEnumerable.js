/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
"use strict";
var EmptyEnumerator_1 = require("./EmptyEnumerator");
var EmptyEnumerable = (function () {
    function EmptyEnumerable() {
        this.isEndless = false;
    }
    EmptyEnumerable.prototype.getEnumerator = function () {
        return EmptyEnumerator_1.EmptyEnumerator;
    };
    return EmptyEnumerable;
}());
exports.EmptyEnumerable = EmptyEnumerable;