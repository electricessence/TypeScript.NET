/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { SimpleEnumerableBase } from "./SimpleEnumerableBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
export class InfiniteEnumerator extends SimpleEnumerableBase {
    constructor(_factory) {
        super();
        this._factory = _factory;
    }
    canMoveNext() {
        return this._factory != null;
    }
    moveNext() {
        const _ = this;
        var f = _._factory;
        if (f) {
            _._current = f(_._current, _.incrementIndex());
            return true;
        }
        return false;
    }
    dispose() {
        super.dispose();
        this._factory = null;
    }
}
export default InfiniteEnumerator;
//# sourceMappingURL=InfiniteEnumerator.js.map