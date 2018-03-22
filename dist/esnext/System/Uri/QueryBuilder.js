/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import Type from "../Types";
import OrderedStringKeyDictionary from "../Collections/Dictionaries/OrderedStringKeyDictionary";
import { isEnumerableOrArrayLike } from "../Collections/Enumeration/Enumerator";
import { encode, parse } from "./QueryParams";
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
        if (Type.isString(query)) {
            this.importFromString(query, decodeValues);
        }
        else if (isEnumerableOrArrayLike(query)) {
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
        parse(values, function (key, value) {
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
        return encode(this, prefixIfNotEmpty);
    };
    QueryBuilder.prototype.toString = function () {
        return this.encode();
    };
    return QueryBuilder;
}(OrderedStringKeyDictionary));
export { QueryBuilder };
export default QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map