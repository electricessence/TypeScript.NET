/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IteratorResult } from "./IteratorResult";
const VOID0 = void 0;
export class SimpleEnumerableBase {
    constructor() {
        this.reset();
    }
    get current() {
        return this._current;
    }
    incrementIndex() {
        let i = this._index;
        this._index = i = i === VOID0 ? 0 : (i + 1);
        return i;
    }
    nextValue() {
        this.moveNext();
        return this._current;
    }
    next() {
        return this.moveNext()
            ? new IteratorResult(this._current, this._index)
            : IteratorResult.Done;
    }
    'return'(value) {
        try {
            return value !== VOID0 && this.canMoveNext()
                ? new IteratorResult(value, VOID0, true)
                : IteratorResult.Done;
        }
        finally {
            this.dispose();
        }
    }
    reset() {
        this._current = VOID0;
        this._index = VOID0;
    }
    dispose() {
        this.reset();
    }
    getIsEndless() {
        return this.canMoveNext();
    }
    get isEndless() {
        return this.getIsEndless();
    }
}
export default SimpleEnumerableBase;
//# sourceMappingURL=SimpleEnumerableBase.js.map