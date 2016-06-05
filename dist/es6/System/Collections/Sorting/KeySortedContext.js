/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as Values from "../../Compare";
import { SortContext } from "./SortContext";
import { Functions } from "../../Functions";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
export class KeySortedContext extends SortContext {
    constructor(next, _keySelector, order = 1, comparer = Values.compare) {
        super(next, comparer, order);
        this._keySelector = _keySelector;
    }
    compare(a, b) {
        var _ = this, ks = _._keySelector;
        if (!ks || ks == Functions.Identity)
            return super.compare(a, b);
        var d = Values.compare(ks(a), ks(b));
        if (d == 0 && _._next)
            return _._next.compare(a, b);
        return _._order * d;
    }
}
export default KeySortedContext;
//# sourceMappingURL=KeySortedContext.js.map