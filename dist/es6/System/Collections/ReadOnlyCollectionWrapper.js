/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ReadOnlyCollectionBase } from "./ReadOnlyCollectionBase";
import { from as enumeratorFrom } from "./Enumeration/Enumerator";
import { Type } from "../Types";
// noinspection JSUnusedLocalSymbols
export default class ReadOnlyCollectionWrapper extends ReadOnlyCollectionBase {
    constructor(collection) {
        super();
        if (!collection)
            throw new ArgumentNullException('collection');
        const _ = this;
        // Attempting to avoid contact with the original collection.
        if (Type.isArrayLike(collection)) {
            _._getCount = () => collection.length;
            _._getEnumerator = () => enumeratorFrom(collection);
        }
        else {
            _._getCount = () => collection.count;
            _._getEnumerator = () => collection.getEnumerator();
        }
    }
    _getCount() {
        this.throwIfDisposed();
        return this.__getCount();
    }
    _getEnumerator() {
        this.throwIfDisposed();
        return this.__getEnumerator();
    }
    _onDispose() {
        super._onDispose();
        this.__getCount = null;
        this.__getEnumerator = null;
    }
}
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map