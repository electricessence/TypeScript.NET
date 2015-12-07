///<reference path="../../import.d.ts"/>
define(["require", "exports", '../../../../source/System/Time/ClockTime'], function (require, exports, ClockTime_1) {
    var assert = require('../../../../node_modules/assert/assert');
    var hour = 23, minute = 36, second = 15, millisecond = 876;
    var c = new ClockTime_1.default(hour, minute, second, millisecond);
    it('should match time values', function () {
        assert.equal(c.hours, hour);
        assert.equal(c.minutes, minute);
        assert.equal(c.seconds, second);
        assert.equal(c.milliseconds, millisecond);
    });
});
//# sourceMappingURL=ClockTime.js.map