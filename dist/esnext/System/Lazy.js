/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import ResolverBase from "./ResolverBase";
// We need a non-resettable lazy to ensure it can be passed safely around.
var Lazy = /** @class */ (function (_super) {
    tslib_1.__extends(Lazy, _super);
    function Lazy(valueFactory, trapExceptions, allowReset) {
        if (trapExceptions === void 0) { trapExceptions = false; }
        if (allowReset === void 0) { allowReset = false; }
        var _this = _super.call(this, valueFactory, trapExceptions, allowReset) || this;
        // @ts-ignore // Force this override.
        _this._disposableObjectName = 'Lazy';
        _this._isValueCreated = false;
        return _this;
    }
    Object.defineProperty(Lazy.prototype, "isValueCreated", {
        get: function () {
            return !!this._isValueCreated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lazy.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Lazy.prototype.equals = function (other) {
        return this == other;
    };
    Lazy.prototype.valueEquals = function (other) {
        return this.equals(other) || this.value === other.value;
    };
    Lazy.create = function (valueFactory, trapExceptions, allowReset) {
        if (trapExceptions === void 0) { trapExceptions = false; }
        if (allowReset === void 0) { allowReset = false; }
        return new Lazy(valueFactory, trapExceptions, allowReset);
    };
    return Lazy;
}(ResolverBase));
export default Lazy;
var ResettableLazy = /** @class */ (function (_super) {
    tslib_1.__extends(ResettableLazy, _super);
    function ResettableLazy(valueFactory, trapExceptions) {
        if (trapExceptions === void 0) { trapExceptions = false; }
        var _this = _super.call(this, valueFactory, trapExceptions, true) || this;
        // @ts-ignore // Force this override.
        _this._disposableObjectName = 'ResettableLazy';
        return _this;
    }
    ResettableLazy.create = function (valueFactory, trapExceptions) {
        if (trapExceptions === void 0) { trapExceptions = false; }
        return new ResettableLazy(valueFactory, trapExceptions);
    };
    return ResettableLazy;
}(Lazy));
export { ResettableLazy };
//# sourceMappingURL=Lazy.js.map