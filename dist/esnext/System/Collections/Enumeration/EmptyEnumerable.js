/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import EmptyEnumerator from "./EmptyEnumerator";
var EmptyEnumerable = /** @class */ (function () {
    function EmptyEnumerable() {
        this.isEndless = false;
    }
    // noinspection JSMethodCanBeStatic
    EmptyEnumerable.prototype.getEnumerator = function () {
        return EmptyEnumerator;
    };
    return EmptyEnumerable;
}());
export default EmptyEnumerable;
//# sourceMappingURL=EmptyEnumerable.js.map