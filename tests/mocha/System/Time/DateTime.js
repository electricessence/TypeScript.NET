"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var DateTime_1 = require("../../../../dist/umd/Time/DateTime");
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
        31 //December
    ];
    it('should match actual Gregorian values.', function () {
        for (var y = startYear; y < 2004; y++) {
            for (var m = 0; m < 12; m++) {
                if (m === 1 && DateTime_1.default.isLeapYear(y)) {
                    assert.equal(DateTime_1.default.daysInMonth(y, m), 29);
                }
                else {
                    assert.equal(DateTime_1.default.daysInMonth(y, m), daysPerMonth[m]);
                }
            }
        }
    });
});
describe(".between(first,last)", function () {
    it("should return a positive delta for proper dates", function () {
        assert.ok(DateTime_1.default.between(new Date("2016-06-06"), new Date("2016-07-06")).total.milliseconds > 0);
    });
});
describe(".equals", function () {
    var d1 = "2016-06-06", d2 = "2016-06-07";
    it("should match", function () {
        var x = new DateTime_1.default(d1), y = new DateTime_1.default(d1);
        assert.ok(x.equals(y));
    });
    it("should not match", function () {
        var x = new DateTime_1.default(d1), y = new DateTime_1.default(d2);
        assert.ok(!x.equals(null));
        assert.ok(!x.equals(y));
    });
    it("should compare correctly", function () {
        var x = new DateTime_1.default(d1), y = new DateTime_1.default(d2), z = new DateTime_1.default(d2);
        assert.ok(x.compareTo(y) < 0);
        assert.ok(y.compareTo(x) > 0);
        assert.ok(y.compareTo(z) === 0);
    });
});
//# sourceMappingURL=DateTime.js.map