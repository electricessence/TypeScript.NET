/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as Values from "../../Compare";
export class SortContext {
    constructor(_next, _comparer = Values.compare, _order = 1) {
        this._next = _next;
        this._comparer = _comparer;
        this._order = _order;
    }
    get order() { return this._order; }
    generateSortedIndexes(source) {
        if (source == null)
            return [];
        var result = source.map((s, i) => i);
        result.sort((a, b) => this.compare(source[a], source[b]));
        return result;
    }
    compare(a, b) {
        var _ = this;
        var d = _._comparer(a, b);
        if (d == 0 && _._next)
            return _._next.compare(a, b);
        return _._order * d;
    }
}
export default SortContext;
//# sourceMappingURL=SortContext.js.map