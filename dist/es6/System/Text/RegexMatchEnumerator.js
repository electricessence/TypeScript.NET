/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Regex } from "./RegularExpressions";
import { empty } from "../Collections/Enumeration/Enumerator";
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
            : empty;
    }
}
export default RegexMatchEnumerator.matches;
//# sourceMappingURL=RegexMatchEnumerator.js.map