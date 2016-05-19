/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "../Collections/Dictionaries/OrderedStringKeyDictionary", "../Collections/Enumeration/Enumerator", "./QueryParams"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var OrderedStringKeyDictionary_1 = require("../Collections/Dictionaries/OrderedStringKeyDictionary");
    var Enumerator_1 = require("../Collections/Enumeration/Enumerator");
    var QueryParams = require("./QueryParams");
    var QueryBuilder = (function (_super) {
        __extends(QueryBuilder, _super);
        function QueryBuilder(query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            _super.call(this);
            this.importQuery(query, decodeValues);
        }
        QueryBuilder.init = function (query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            return new QueryBuilder(query, decodeValues);
        };
        QueryBuilder.prototype.importQuery = function (query, decodeValues) {
            if (decodeValues === void 0) { decodeValues = true; }
            if (Types_1.Type.isString(query)) {
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
        QueryBuilder.prototype.importFromString = function (values, deserialize, decodeValues) {
            if (deserialize === void 0) { deserialize = true; }
            if (decodeValues === void 0) { decodeValues = true; }
            var _ = this;
            QueryParams.parse(values, function (key, value) {
                if (_.containsKey(key)) {
                    var prev = _.getValue(key);
                    if (Array.isArray(prev))
                        prev.push(value);
                    else
                        _.setValue(key, [prev, value]);
                }
                else
                    _.setValue(key, value);
            }, deserialize, decodeValues);
            return this;
        };
        QueryBuilder.prototype.encode = function (prefixIfNotEmpty) {
            return QueryParams.encode(this, prefixIfNotEmpty);
        };
        QueryBuilder.prototype.toString = function () {
            return this.encode();
        };
        return QueryBuilder;
    }(OrderedStringKeyDictionary_1.OrderedStringKeyDictionary));
    exports.QueryBuilder = QueryBuilder;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QueryBuilder;
});
//# sourceMappingURL=QueryBuilder.js.map