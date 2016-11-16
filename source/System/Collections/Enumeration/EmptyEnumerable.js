/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./EmptyEnumerator"], function (require, exports) {
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
});
//# sourceMappingURL=EmptyEnumerable.js.map