/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { CollectionBase } from "./CollectionBase";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
export class ReadOnlyCollectionBase extends CollectionBase {
    getCount() {
        return this._getCount();
    }
    getIsReadOnly() {
        return true;
    }
    _addInternal(entry) {
        return false;
    }
    _removeInternal(entry, max) {
        return 0;
    }
    _clearInternal() {
        return 0;
    }
    getEnumerator() {
        return this._getEnumerator();
    }
}
export default ReadOnlyCollectionBase;
//# sourceMappingURL=ReadOnlyCollectionBase.js.map