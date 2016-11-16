(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "assert", "../../../../dist/commonjs/System/Threading/Tasks/TaskHandler", "../../../../dist/commonjs/System/Functions"], function (require, exports) {
    "use strict";
    var assert = require("assert");
    var TaskHandler_1 = require("../../../../dist/commonjs/System/Threading/Tasks/TaskHandler");
    var Functions_1 = require("../../../../dist/commonjs/System/Functions");
    describe('new', function () {
        it("should throw", function () {
            assert.throws(function () {
                new TaskHandler_1.default(null);
            });
            assert.doesNotThrow(function () {
                (new TaskHandler_1.default(Functions_1.default.Blank)).dispose();
            });
        });
    });
});
//# sourceMappingURL=TaskHandler.js.map