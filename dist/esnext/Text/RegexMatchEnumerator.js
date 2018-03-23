/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Regex from "./RegularExpressions";
import EmptyEnumerator from "../Collections/Enumeration/EmptyEnumerator";
import EnumeratorBase from "../Collections/Enumeration/EnumeratorBase";
var RegexMatchEnumerator = /** @class */ (function () {
    function RegexMatchEnumerator(pattern) {
        if (pattern instanceof Regex) {
            this._pattern = pattern;
        }
        else {
            this._pattern = new Regex(pattern);
        }
    }
    RegexMatchEnumerator.prototype.matches = function (input) {
        var _this = this;
        var p; // pointer
        return new EnumeratorBase(function () {
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
            : EmptyEnumerator;
    };
    return RegexMatchEnumerator;
}());
export { RegexMatchEnumerator };
export default RegexMatchEnumerator.matches;
//# sourceMappingURL=RegexMatchEnumerator.js.map