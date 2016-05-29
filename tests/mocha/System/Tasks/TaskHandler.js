(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../source/System/Threading/Tasks/TaskHandler", "../../../../source/System/Functions"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TaskHandler_1 = require("../../../../source/System/Threading/Tasks/TaskHandler");
    var Functions_1 = require("../../../../source/System/Functions");
    var assert = require('../../../../node_modules/assert/assert');
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