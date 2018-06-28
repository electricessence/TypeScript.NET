"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var ReadOnlyCollectionBase_1 = require("./ReadOnlyCollectionBase");
var Enumerator_1 = require("./Enumeration/Enumerator");
var Types_1 = require("../Types");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var ReadOnlyCollectionWrapper = /** @class */ (function (_super) {
    __extends(ReadOnlyCollectionWrapper, _super);
    function ReadOnlyCollectionWrapper(collection) {
        var _this = _super.call(this) || this;
        if (!collection)
            throw new ArgumentNullException_1.ArgumentNullException('collection');
        // Attempting to avoid contact with the original collection.
        if (Types_1.Type.isArrayLike(collection)) {
            _this.__getCount = function () { return collection.length; };
            _this.__getEnumerator = function () { return Enumerator_1.from(collection); };
        }
        else {
            _this.__getCount = function () { return collection.count; };
            _this.__getEnumerator = function () { return collection.getEnumerator(); };
        }
        return _this;
    }
    ReadOnlyCollectionWrapper.prototype._getCount = function () {
        this.throwIfDisposed();
        return this.__getCount();
    };
    ReadOnlyCollectionWrapper.prototype._getEnumerator = function () {
        this.throwIfDisposed();
        return this.__getEnumerator();
    };
    ReadOnlyCollectionWrapper.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this.__getCount = null;
        this.__getEnumerator = null;
    };
    return ReadOnlyCollectionWrapper;
}(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
exports.default = ReadOnlyCollectionWrapper;
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map