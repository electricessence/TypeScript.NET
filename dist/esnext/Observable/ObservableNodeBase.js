/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
import * as tslib_1 from "tslib";
// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
import ObservableBase from "./ObservableBase";
var ObservableNodeBase = /** @class */ (function (_super) {
    tslib_1.__extends(ObservableNodeBase, _super);
    function ObservableNodeBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObservableNodeBase.prototype.onNext = function (value) {
        this._onNext(value);
    };
    ObservableNodeBase.prototype.onError = function (error) {
        this._onError(error);
    };
    ObservableNodeBase.prototype.onCompleted = function () {
        this._onCompleted();
    };
    return ObservableNodeBase;
}(ObservableBase));
export { ObservableNodeBase };
export default ObservableNodeBase;
//# sourceMappingURL=ObservableNodeBase.js.map