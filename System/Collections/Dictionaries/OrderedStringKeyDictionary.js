/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './StringKeyDictionary', '../Arrays/Utility'], function (require, exports, StringKeyDictionary, ArrayUtility) {
    var OrderedStringKeyDictionary = (function (_super) {
        __extends(OrderedStringKeyDictionary, _super);
        function OrderedStringKeyDictionary() {
            _super.call(this);
            // noinspection JSMismatchedCollectionQueryUpdate
            this._order = []; // Maintains indexes.
        }
        OrderedStringKeyDictionary.prototype.indexOfKey = function (key) {
            return this._order.indexOf(key, 0);
        };
        OrderedStringKeyDictionary.prototype.getValueByIndex = function (index) {
            return this.get(this._order[index]);
        };
        // adding keepIndex allows for clearing a value while still retaining it's index.
        OrderedStringKeyDictionary.prototype.set = function (key, value, keepIndex) {
            var _ = this, exists = _.indexOfKey(key) != -1;
            if (!exists && (value !== undefined || keepIndex))
                _._order.push(key);
            else if (exists && value === undefined && !keepIndex)
                ArrayUtility.remove(_._order, key);
            return _super.prototype.set.call(this, key, value);
        };
        OrderedStringKeyDictionary.prototype.setByIndex = function (index, value) {
            var _ = this, order = _._order;
            if (index < 0 || index >= order.length)
                throw new Error("IndexOutOfRange Exception.");
            return _.set(order[index], value);
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
                values[_i - 0] = arguments[_i];
            }
            return this.importValues(values);
        };
        OrderedStringKeyDictionary.prototype.removeByIndex = function (index) {
            return this.setByIndex(index, undefined);
        };
        Object.defineProperty(OrderedStringKeyDictionary.prototype, "keys", {
            get: function () {
                var _ = this;
                return _._order.filter(function (key) { return _.containsKey(key); });
            },
            enumerable: true,
            configurable: true
        });
        return OrderedStringKeyDictionary;
    })(StringKeyDictionary);
    return OrderedStringKeyDictionary;
});
//# sourceMappingURL=OrderedStringKeyDictionary.js.map