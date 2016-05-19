/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ReadOnlyCollectionBase } from "./ReadOnlyCollectionBase";
export default class ReadOnlyCollectionWrapper extends ReadOnlyCollectionBase {
    constructor(c) {
        super();
        if (!c)
            throw new ArgumentNullException('collection');
        var _ = this;
        _._getCount = () => c.count;
        _.getEnumerator = () => c.getEnumerator();
    }
}
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map