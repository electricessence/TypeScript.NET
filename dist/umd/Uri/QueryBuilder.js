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
        define(["require", "exports", "tslib", "../Collections/Dictionaries/OrderedStringKeyDictionary", "../Collections/Enumeration/Enumerator", "./QueryParams", "../Reflection/isString"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var OrderedStringKeyDictionary_1 = require("../Collections/Dictionaries/OrderedStringKeyDictionary");
    var Enumerator_1 = require("../Collections/Enumeration/Enumerator");
    var QueryParams_1 = require("./QueryParams");
    var isString_1 = require("../Reflection/isString");
    /**
     * Provides a means for parsing and building a set of parameters.
     *
     * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
     */
    var QueryBuilder = /** @class */ (function (_super) {
        tslib_1.__extends(QueryBuilder, _super);
        function QueryBuilder(query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            var _this = _super.call(this) || this;
            _this.importQuery(query, decodeValues);
            return _this;
        }
        QueryBuilder.init = function (query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            return new QueryBuilder(query, decodeValues);
        };
        QueryBuilder.prototype.importQuery = function (query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            if (isString_1.default(query)) {
                this.importFromString(query, decodeValues);
            }
            else if (Enumerator_1.isEnumerableOrArrayLike(query)) {
                this.importEntries(query);
            }
            else {
                this.importMap(query);
            }
            return this;
        };
        /**
         * Property parses the components of an URI into their values or array of values.
         * @param values
         * @param deserialize
         * @param decodeValues
         * @returns {QueryBuilder}
         */
        QueryBuilder.prototype.importFromString = function (values, deserialize, decodeValues) {
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            var _ = this;
            QueryParams_1.parse(values, function (key, value) {
                if (_.containsKey(key)) {
                    var prev = _.getValue(key);
                    if ((prev) instanceof (Array))
                        prev.push(value);
                    else
                        _.setValue(key, [prev, value]);
                }
                else
                    _.setValue(key, value);
            }, deserialize, decodeValues);
            return this;
        };
        /**
         * Returns the encoded URI string
         */
        QueryBuilder.prototype.encode = function (prefixIfNotEmpty) {
            return QueryParams_1.encode(this, prefixIfNotEmpty);
        };
        QueryBuilder.prototype.toString = function () {
            return this.encode();
        };
        return QueryBuilder;
    }(OrderedStringKeyDictionary_1.default));
    exports.QueryBuilder = QueryBuilder;
    exports.default = QueryBuilder;
});
//# sourceMappingURL=QueryBuilder.js.map