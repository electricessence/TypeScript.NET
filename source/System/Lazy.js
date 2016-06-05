/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ResolverBase", "../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ResolverBase_1 = require("./ResolverBase");
    var extends_1 = require("../extends");
    var __extends = extends_1.default;
    var Lazy = (function (_super) {
        __extends(Lazy, _super);
        function Lazy(valueFactory, trapExceptions, allowReset) {
            if (trapExceptions === void 0) { trapExceptions = false; }
            if (allowReset === void 0) { allowReset = false; }
            _super.call(this, valueFactory, trapExceptions, allowReset);
            this._disposableObjectName = 'Lazy';
            this._isValueCreated = false;
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
        return Lazy;
    }(ResolverBase_1.ResolverBase));
    exports.Lazy = Lazy;
    var ResettableLazy = (function (_super) {
        __extends(ResettableLazy, _super);
        function ResettableLazy(valueFactory, trapExceptions) {
            if (trapExceptions === void 0) { trapExceptions = false; }
            _super.call(this, valueFactory, trapExceptions, true);
        }
        return ResettableLazy;
    }(Lazy));
    exports.ResettableLazy = ResettableLazy;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Lazy;
});
//# sourceMappingURL=Lazy.js.map