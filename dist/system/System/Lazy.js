/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./ResolverBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ResolverBase_1;
    var Lazy;
    return {
        setters:[
            function (ResolverBase_1_1) {
                ResolverBase_1 = ResolverBase_1_1;
            }],
        execute: function() {
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
            exports_1("default",Lazy);
        }
    }
});
//# sourceMappingURL=Lazy.js.map