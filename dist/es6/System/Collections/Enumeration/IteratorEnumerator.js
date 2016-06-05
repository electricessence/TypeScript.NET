/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const VOID0 = void 0;
export class IteratorEnumerator extends SimpleEnumerableBase {
    constructor(_iterator, _isEndless) {
        super();
        this._iterator = _iterator;
        this._isEndless = _isEndless;
    }
    canMoveNext() {
        return this._iterator != null;
    }
    moveNext(value) {
        var _ = this;
        var i = _._iterator;
        if (i) {
            var r = arguments.length ? i.next(value) : i.next();
            _._current = r.value;
            if (r.done)
                _.dispose();
            else
                return true;
        }
        return false;
    }
    dispose() {
        super.dispose();
        this._iterator = VOID0;
    }
    getIsEndless() {
        return this._isEndless && super.getIsEndless();
    }
}
export default IteratorEnumerator;
//# sourceMappingURL=IteratorEnumerator.js.map