"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/text/StringBuilder.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/string-concatenation-looped
 * http://jsperf.com/adding-strings-to-an-array
 * http://jsperf.com/string-concatenation-versus-array-operations-with-join
 *
 * It is clearly inefficient to use a StringBuilder or LinkedList to build a string when you have a small set of string portions.
 * StringBuilder will really show it's benefit likely somewhere above 1000 items.
 *****************************/
var EMPTY = "";
var NEWLINE = "\r\n";
var StringBuilder = /** @class */ (function () {
    function StringBuilder() {
        var initial = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            initial[_i] = arguments[_i];
        }
        this._latest = null;
        this._partArray = [];
        this.appendThese(initial);
    }
    StringBuilder.prototype.appendSingle = function (item) {
        if (item != null) {
            var _ = this;
            _._latest = null;
            switch (typeof item) {
                case Types_1.Type.OBJECT:
                case Types_1.Type.FUNCTION:
                    item = item.toString();
                    break;
            }
            _._partArray.push(item); // Other primitive types can keep their format since a number or boolean is a smaller footprint than a string.
        }
    };
    StringBuilder.prototype.appendThese = function (items) {
        var _ = this;
        items.forEach(function (s) { return _.appendSingle(s); });
        return _;
    };
    StringBuilder.prototype.append = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this.appendThese(items);
        return this;
    };
    StringBuilder.prototype.appendLine = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        this.appendLines(items);
        return this;
    };
    StringBuilder.prototype.appendLines = function (items) {
        var _ = this;
        items.forEach(function (i) {
            if (i != null) {
                _.appendSingle(i);
                _._partArray.push(NEWLINE);
            }
        });
        return _;
    };
    Object.defineProperty(StringBuilder.prototype, "isEmpty", {
        /** /// These methods can only efficiently be added if not using a single array.
         insert(index: number, value: string, count: number = 1): StringBuilder
         {
        }
         remove(startIndex:number, length:number): StringBuilder
         {
        }
         /**/
        get: function () {
            return this._partArray.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    StringBuilder.prototype.toString = function () {
        var latest = this._latest;
        if (latest == null)
            this._latest = latest = this._partArray.join(EMPTY);
        return latest;
    };
    StringBuilder.prototype.join = function (delimiter) {
        return this._partArray.join(delimiter);
    };
    StringBuilder.prototype.clear = function () {
        this._partArray.length = 0;
        this._latest = null;
    };
    StringBuilder.prototype.dispose = function () {
        this.clear();
    };
    return StringBuilder;
}());
exports.StringBuilder = StringBuilder;
exports.default = StringBuilder;
//# sourceMappingURL=StringBuilder.js.map