/*!
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export var TimeUnit;
(function (TimeUnit) {
    TimeUnit[TimeUnit["Ticks"] = 0] = "Ticks";
    TimeUnit[TimeUnit["Milliseconds"] = 1] = "Milliseconds";
    TimeUnit[TimeUnit["Seconds"] = 2] = "Seconds";
    TimeUnit[TimeUnit["Minutes"] = 3] = "Minutes";
    TimeUnit[TimeUnit["Hours"] = 4] = "Hours";
    TimeUnit[TimeUnit["Days"] = 5] = "Days";
})(TimeUnit || (TimeUnit = {}));
export var TimeUnit;
(function (TimeUnit) {
    function toMilliseconds(value, units = TimeUnit.Milliseconds) {
        switch (units) {
            case TimeUnit.Days:
                value *= 24;
            case TimeUnit.Hours:
                value *= 60;
            case TimeUnit.Minutes:
                value *= 60;
            case TimeUnit.Seconds:
                value *= 1000;
            case TimeUnit.Milliseconds:
                return value;
            case TimeUnit.Ticks:
                return value / 10000;
            default:
                throw new Error("Invalid TimeUnit.");
        }
    }
    TimeUnit.toMilliseconds = toMilliseconds;
    function fromMilliseconds(ms, units) {
        switch (units) {
            case TimeUnit.Days:
                return ms / 86400000;
            case TimeUnit.Hours:
                return ms / 3600000;
            case TimeUnit.Minutes:
                return ms / 60000;
            case TimeUnit.Seconds:
                return ms / 1000;
            case TimeUnit.Milliseconds:
                return ms;
            case TimeUnit.Ticks:
                return ms * 10000;
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
})(TimeUnit || (TimeUnit = {}));
Object.freeze(TimeUnit);
export default TimeUnit;
//# sourceMappingURL=TimeUnit.js.map