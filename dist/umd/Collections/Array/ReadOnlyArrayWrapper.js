/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../ReadOnlyCollectionWrapper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ReadOnlyCollectionWrapper_1 = require("../ReadOnlyCollectionWrapper");
    var ReadOnlyArrayWrapper = /** @class */ (function (_super) {
        tslib_1.__extends(ReadOnlyArrayWrapper, _super);
        function ReadOnlyArrayWrapper(array) {
            var _this = _super.call(this, array) || this;
            _this.__getValueAt = function (i) { return array[i]; };
            return _this;
        }
        ReadOnlyArrayWrapper.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this.__getValueAt = null;
        };
        ReadOnlyArrayWrapper.prototype.getValueAt = function (index) {
            this.throwIfDisposed();
            return this.__getValueAt(index);
        };
        return ReadOnlyArrayWrapper;
    }(ReadOnlyCollectionWrapper_1.default));
    exports.default = ReadOnlyArrayWrapper;
});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map