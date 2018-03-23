/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import StringKeyDictionary from "./StringKeyDictionary";
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
import Integer from "../../Integer";
import removeElement from "../Array/removeElement";
var VOID0 = void 0;
var OrderedStringKeyDictionary = /** @class */ (function (_super) {
    tslib_1.__extends(OrderedStringKeyDictionary, _super);
    function OrderedStringKeyDictionary() {
        var _this = _super.call(this) || this;
        // noinspection JSMismatchedCollectionQueryUpdate
        _this._order = []; // Maintains indexes.
        return _this;
    }
    OrderedStringKeyDictionary.prototype.indexOfKey = function (key) {
        var o = this._order;
        return o.length ? o.indexOf(key, 0) : -1;
    };
    OrderedStringKeyDictionary.prototype.getValueByIndex = function (index) {
        Integer.assertZeroOrGreater(index);
        var o = this._order;
        if (index < o.length)
            return this.getAssuredValue(o[index]);
        throw new ArgumentOutOfRangeException('index', index);
    };
    // adding keepIndex allows for clearing a value while still retaining it's index.
    OrderedStringKeyDictionary.prototype.setValue = function (key, value, keepIndex) {
        // TODO: This may be inefficient and could be improved.
        var _ = this;
        var exists = _.indexOfKey(key) != -1;
        if (!exists && (value !== VOID0 || keepIndex))
            _._order.push(key);
        else if (exists && value === VOID0 && !keepIndex)
            removeElement(_._order, key);
        return _super.prototype.setValue.call(this, key, value);
    };
    OrderedStringKeyDictionary.prototype.setByIndex = function (index, value) {
        var _ = this;
        var order = _._order;
        if (index < 0)
            throw new ArgumentOutOfRangeException('index', index, 'Is less than zero.');
        if (index >= order.length)
            throw new ArgumentOutOfRangeException('index', index, 'Is greater than the count.');
        return _.setValue(order[index], value);
    };
    // importValues([x,y,z]);
    OrderedStringKeyDictionary.prototype.importValues = function (values) {
        var _ = this;
        return _.handleUpdate(function () {
            var changed = false;
            for (var i = 0; i < values.length; i++) {
                if (_.setByIndex(i, values[i]))
                    changed = true;
            }
            return changed;
        });
    };
    // setValues(x,y,z);
    OrderedStringKeyDictionary.prototype.setValues = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return this.importValues(values);
    };
    OrderedStringKeyDictionary.prototype.removeByIndex = function (index) {
        return this.setByIndex(index, VOID0);
    };
    OrderedStringKeyDictionary.prototype.getKeys = function () {
        var _ = this;
        var o = _._order;
        return o.length && o.filter(function (key) { return _.containsKey(key); }) || [];
    };
    return OrderedStringKeyDictionary;
}(StringKeyDictionary));
export default OrderedStringKeyDictionary;
//# sourceMappingURL=OrderedStringKeyDictionary.js.map