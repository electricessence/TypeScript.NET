/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Regex } from "./RegularExpressions";
import { EmptyEnumerator } from "../Collections/Enumeration/EmptyEnumerator";
import { EnumeratorBase } from "../Collections/Enumeration/EnumeratorBase";
export class RegexMatchEnumerator {
    constructor(pattern) {
        if (pattern instanceof Regex) {
            this._pattern = pattern;
        }
        else {
            this._pattern = new Regex(pattern);
        }
    }
    matches(input) {
        var p;
        return new EnumeratorBase(() => {
            p = 0;
        }, yielder => {
            let match = this._pattern.match(input, p);
            if (match.success) {
                p = match.index + match.length;
                return yielder.yieldReturn(match);
            }
            return yielder.yieldBreak();
        });
    }
    static matches(input, pattern) {
        return input && pattern
            ? (new RegexMatchEnumerator(pattern)).matches(input)
            : EmptyEnumerator;
    }
}
export default RegexMatchEnumerator.matches;
//# sourceMappingURL=RegexMatchEnumerator.js.map