/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as Values from "../../Compare";
import { SortContext } from "./SortContext";
import { Functions } from "../../Functions";
// noinspection JSUnusedLocalSymbols
export class KeySortedContext extends SortContext {
    constructor(next, _keySelector, order = 1 /* Ascending */, comparer = Values.compare) {
        super(next, comparer, order);
        this._keySelector = _keySelector;
    }
    compare(a, b) {
        const _ = this;
        let ks = _._keySelector;
        if (!ks || ks == Functions.Identity)
            return super.compare(a, b);
        // We force <any> here since it can be a Primitive or IComparable<any>
        const d = Values.compare(ks(a), ks(b));
        if (d == 0 && _._next)
            return _._next.compare(a, b);
        return _._order * d;
    }
}
export default KeySortedContext;
//# sourceMappingURL=KeySortedContext.js.map