/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./RegularExpressions", "../Collections/Enumeration/EnumeratorBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var RegularExpressions_1 = require("./RegularExpressions");
    var EnumeratorBase_1 = require("../Collections/Enumeration/EnumeratorBase");
    var RegexMatchEnumerator = (function () {
        function RegexMatchEnumerator(pattern) {
            if (pattern instanceof RegularExpressions_1.Regex) {
                this._pattern = pattern;
            }
            else {
                this._pattern = new RegularExpressions_1.Regex(pattern);
            }
        }
        RegexMatchEnumerator.prototype.matches = function (input) {
            var _this = this;
            var tempInput = null;
            return new EnumeratorBase_1.default(function () {
                tempInput = input;
            }, function (yielder) {
                var match = _this._pattern.match(tempInput);
                if (match.success) {
                    tempInput = tempInput.substring(match.index + match.length);
                    return yielder.yieldReturn(match);
                }
                return yielder.yieldBreak();
            });
        };
        return RegexMatchEnumerator;
    }());
    exports.RegexMatchEnumerator = RegexMatchEnumerator;
});
//# sourceMappingURL=RegexMatchEnumerator.js.map