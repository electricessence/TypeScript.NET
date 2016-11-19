(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "assert", "mocha", "../../../../dist/commonjs/System/Time/ClockTime", "../../../../dist/commonjs/System/Time/HowMany", "../../../../dist/commonjs/System/Integer"], function (require, exports) {
    "use strict";
    var assert = require("assert");
    require("mocha");
    var ClockTime_1 = require("../../../../dist/commonjs/System/Time/ClockTime");
    var HowMany_1 = require("../../../../dist/commonjs/System/Time/HowMany");
    var Integer_1 = require("../../../../dist/commonjs/System/Integer");
    var days = Integer_1.default.random(365), hour = Integer_1.default.random(24), minute = Integer_1.default.random(60), second = Integer_1.default.random(60), millisecond = Integer_1.default.random(1000);
    var c1 = new ClockTime_1.default(hour, minute, second, millisecond);
    var c2 = new ClockTime_1.default(days * HowMany_1.Milliseconds.Per.Day
        + hour * HowMany_1.Milliseconds.Per.Hour
        + minute * HowMany_1.Milliseconds.Per.Minute
        + second * HowMany_1.Milliseconds.Per.Second
        + millisecond);
    describe(".", function () {
        it('should match constructor values', function () {
            assert.equal(c1.hour, hour);
            assert.equal(c1.minute, minute);
            assert.equal(c1.second, second);
            assert.equal(c1.millisecond, millisecond);
        });
        it('should match summed values', function () {
            assert.equal(c2.days, days);
            assert.equal(c2.hour, hour);
            assert.equal(c2.minute, minute);
            assert.equal(c2.second, second);
            assert.equal(c2.millisecond, millisecond);
        });
    });
});
//# sourceMappingURL=ClockTime.js.map