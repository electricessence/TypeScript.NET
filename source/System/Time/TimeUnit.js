/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var TimeUnit;
    (function (TimeUnit) {
        TimeUnit[TimeUnit["Ticks"] = 0] = "Ticks";
        TimeUnit[TimeUnit["Milliseconds"] = 1] = "Milliseconds";
        TimeUnit[TimeUnit["Seconds"] = 2] = "Seconds";
        TimeUnit[TimeUnit["Minutes"] = 3] = "Minutes";
        TimeUnit[TimeUnit["Hours"] = 4] = "Hours";
        TimeUnit[TimeUnit["Days"] = 5] = "Days";
    })(TimeUnit || (TimeUnit = {}));
    Object.freeze(TimeUnit);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TimeUnit;
});
//# sourceMappingURL=TimeUnit.js.map