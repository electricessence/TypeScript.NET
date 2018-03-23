/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import getIdentifier from "./Dictionaries/getIdentifier";
import { HashSet } from "./HashSet";
function getId(obj) {
    return getIdentifier(obj, typeof obj != "boolean" /* Boolean */);
}
var Set = /** @class */ (function (_super) {
    tslib_1.__extends(Set, _super);
    function Set(source) {
        return _super.call(this, source, getId) || this;
    }
    return Set;
}(HashSet));
export default Set;
//# sourceMappingURL=Set.js.map