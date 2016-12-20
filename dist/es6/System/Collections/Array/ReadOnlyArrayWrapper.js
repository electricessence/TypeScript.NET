/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ReadOnlyCollectionWrapper from "../ReadOnlyCollectionWrapper";
// noinspection JSUnusedLocalSymbols
export default class ReadOnlyArrayWrapper extends ReadOnlyCollectionWrapper {
    constructor(array) {
        super(array);
        this.__getValueAt = i => array[i];
    }
    _onDispose() {
        super._onDispose();
        this.__getValueAt = null;
    }
    getValueAt(index) {
        this.throwIfDisposed();
        return this.__getValueAt(index);
    }
}
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map