(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "assert", "../../../../dist/commonjs/System/Diagnostics/Stopwatch"], function (require, exports) {
    "use strict";
    var assert = require("assert");
    var Stopwatch_1 = require("../../../../dist/commonjs/System/Diagnostics/Stopwatch");
    it("should measure a closure", function () {
        assert.ok(Stopwatch_1.default.measure(function () {
            for (var i = 0; i < 100000; i++) {
                new Array(100);
            }
        }).milliseconds > 0);
    });
    it("should start, stop, and reset with isRunning correctly reflected", function () {
        assert.ok(Stopwatch_1.default.getTimestampMilliseconds() > 0);
        var sw = new Stopwatch_1.default();
        assert.equal(sw.elapsed.milliseconds, 0);
        assert.equal(sw.lap().milliseconds, 0);
        assert.equal(sw.currentLap.milliseconds, 0);
        assert.equal(sw.currentLapMilliseconds, 0);
        sw = Stopwatch_1.default.startNew();
        sw.start();
        sw.lap();
        assert.ok(sw.elapsedMilliseconds >= 0);
        assert.ok(sw.currentLap.milliseconds >= 0);
        assert.ok(sw.isRunning);
        sw.stop();
        sw.stop();
        assert.ok(!sw.isRunning);
        sw.start();
        assert.ok(sw.isRunning);
        sw.reset();
        assert.ok(!sw.isRunning);
    });
});
//# sourceMappingURL=Stopwatch.js.map