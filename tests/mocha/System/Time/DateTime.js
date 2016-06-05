"use strict";
var DateTime_1 = require('../../../../dist/commonjs/System/Time/DateTime');
var assert = require('../../../../node_modules/assert/assert');
describe(".daysInMonth(year,month) & .isLeapYear(year)", function () {
    var startYear = 2000;
    var daysPerMonth = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];
    it('should match actual Gregorian values.', function () {
        for (var y = startYear; y < 2004; y++) {
            for (var m = 0; m < 12; m++) {
                if (m == 1 && DateTime_1.default.isLeapYear(y)) {
                    assert.equal(DateTime_1.default.daysInMonth(y, m), 29);
                }
                else {
                    assert.equal(DateTime_1.default.daysInMonth(y, m), daysPerMonth[m]);
                }
            }
        }
    });
});

//# sourceMappingURL=DateTime.js.map
