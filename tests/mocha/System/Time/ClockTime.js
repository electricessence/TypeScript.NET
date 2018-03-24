"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var ClockTime_1 = require("../../../../dist/umd/Time/ClockTime");
var Random_1 = require("../../../../dist/umd/Random");
var days = Random_1.Random.integer(364) + 1, hour = Random_1.Random.integer(24), minute = Random_1.Random.integer(60), second = Random_1.Random.integer(60), millisecond = Random_1.Random.integer(1000);
var c1 = new ClockTime_1.default(hour, minute, second, millisecond);
var c2 = new ClockTime_1.default(days * 86400000 /* Day */
    + hour * 3600000 /* Hour */
    + minute * 60000 /* Minute */
    + second * 1000 /* Second */
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
describe(".equals", function () {
    it('should not be equal', function () {
        assert.ok(!c1.equals(c2));
    });
    it('c1 should be less than c2', function () {
        assert.ok(c1.compareTo(c2) < 0);
    });
});
//# sourceMappingURL=ClockTime.js.map