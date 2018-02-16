"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var RegularExpressions_1 = require("./RegularExpressions");
var EmptyEnumerator_1 = require("../Collections/Enumeration/EmptyEnumerator");
var EnumeratorBase_1 = require("../Collections/Enumeration/EnumeratorBase");
var RegexMatchEnumerator = /** @class */ (function () {
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
        var p; // pointer
        return new EnumeratorBase_1.EnumeratorBase(function () {
            p = 0;
        }, function (yielder) {
            var match = _this._pattern.match(input, p);
            if (match.success) {
                p = match.index + match.length;
                return yielder.yieldReturn(match);
            }
            return yielder.yieldBreak();
        });
    };
    RegexMatchEnumerator.matches = function (input, pattern) {
        return input && pattern
            ? (new RegexMatchEnumerator(pattern)).matches(input)
            : EmptyEnumerator_1.EmptyEnumerator;
    };
    return RegexMatchEnumerator;
}());
exports.RegexMatchEnumerator = RegexMatchEnumerator;
exports.default = RegexMatchEnumerator.matches;
//# sourceMappingURL=RegexMatchEnumerator.js.map