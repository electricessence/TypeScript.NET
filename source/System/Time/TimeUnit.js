define(["require", "exports"], function (require, exports) {
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
    return TimeUnit;
});
//# sourceMappingURL=TimeUnit.js.map