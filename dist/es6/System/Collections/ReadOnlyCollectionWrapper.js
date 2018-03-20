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
            this.__getCount = () => collection.length;
            this.__getEnumerator = () => enumeratorFrom(collection);
        }
        else {
            this.__getCount = () => collection.count;
            this.__getEnumerator = () => collection.getEnumerator();
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
        const _ = this;
        _.__getCount = null;
        _.__getEnumerator = null;
    }
}
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map