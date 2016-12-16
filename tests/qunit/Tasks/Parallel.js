(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../../../dist/amd/System/Threading/Tasks/Parallel"], function (require, exports) {
    "use strict";
    var Parallel_1 = require("../../../dist/amd/System/Threading/Tasks/Parallel");
    function run() {
        Parallel_1.Parallel.maxConcurrency(3)
            .startNew([1, 2, 3], function (data) {
            console.log(data);
        })
            .then(function () {
            console.log("parallel check ok");
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=Parallel.js.map