/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./ResolverBase", "../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ResolverBase_1, extends_1;
    var __extends, Lazy, ResettableLazy;
    return {
        setters:[
            function (ResolverBase_1_1) {
                ResolverBase_1 = ResolverBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            Lazy = (function (_super) {
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
            exports_1("Lazy", Lazy);
            ResettableLazy = (function (_super) {
                __extends(ResettableLazy, _super);
                function ResettableLazy(valueFactory, trapExceptions) {
                    if (trapExceptions === void 0) { trapExceptions = false; }
                    _super.call(this, valueFactory, trapExceptions, true);
                }
                return ResettableLazy;
            }(Lazy));
            exports_1("ResettableLazy", ResettableLazy);
            exports_1("default",Lazy);
        }
    }
});
//# sourceMappingURL=Lazy.js.map