"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TimeUnit;
(function (TimeUnit) {
    TimeUnit[TimeUnit["Ticks"] = 0] = "Ticks";
    TimeUnit[TimeUnit["Milliseconds"] = 1] = "Milliseconds";
    TimeUnit[TimeUnit["Seconds"] = 2] = "Seconds";
    TimeUnit[TimeUnit["Minutes"] = 3] = "Minutes";
    TimeUnit[TimeUnit["Hours"] = 4] = "Hours";
    TimeUnit[TimeUnit["Days"] = 5] = "Days";
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {})); // Earth Days
(function (TimeUnit) {
    function toMilliseconds(value, units) {
        if (units === void 0) { units = TimeUnit.Milliseconds; }
        // noinspection FallThroughInSwitchStatementJS
        switch (units) {
            case TimeUnit.Days:
                value *= 24 /* Day */;
            case TimeUnit.Hours:
                value *= 60 /* Hour */;
            case TimeUnit.Minutes:
                value *= 60 /* Minute */;
            case TimeUnit.Seconds:
                value *= 1000 /* Second */;
            case TimeUnit.Milliseconds:
                return value;
            case TimeUnit.Ticks:
                return value / 10000 /* Millisecond */;
            default:
                throw new Error("Invalid TimeUnit.");
        }
    }
    TimeUnit.toMilliseconds = toMilliseconds;
    function fromMilliseconds(ms, units) {
        switch (units) {
            case TimeUnit.Days:
                return ms / 86400000 /* Day */;
            case TimeUnit.Hours:
                return ms / 3600000 /* Hour */;
            case TimeUnit.Minutes:
                return ms / 60000 /* Minute */;
            case TimeUnit.Seconds:
                return ms / 1000 /* Second */;
            case TimeUnit.Milliseconds:
                return ms;
            case TimeUnit.Ticks:
                return ms * 10000 /* Millisecond */;
            default:
                throw new Error("Invalid TimeUnit.");
        }
    }
    TimeUnit.fromMilliseconds = fromMilliseconds;
    function from(quantity, unit) {
        return quantity && fromMilliseconds(quantity.getTotalMilliseconds(), unit);
    }
    TimeUnit.from = from;
    function assertValid(unit) {
        if (isNaN(unit) || unit > TimeUnit.Days || unit < TimeUnit.Ticks || Math.floor(unit) !== unit)
            throw new Error("Invalid TimeUnit.");
        return true;
    }
    TimeUnit.assertValid = assertValid;
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
Object.freeze(TimeUnit);
exports.default = TimeUnit;
//# sourceMappingURL=TimeUnit.js.map