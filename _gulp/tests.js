(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "gulp-typescript-helper", "./constants/TaskNames", "gulp", "../source/System/Promises/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var TASK = require("./constants/TaskNames");
    var gulp = require("gulp");
    var Promise_1 = require("../source/System/Promises/Promise");
    var TEST_DEFAULTS = Object.freeze({ noEmitHelpers: false });
    var renderer = gulp_typescript_helper_1.TypeScriptRenderer
        .inject(Promise_1.Promise)
        .defaults({
        target: gulp_typescript_helper_1.Target.ES5,
        module: gulp_typescript_helper_1.Module.UMD,
        noEmitHelpers: false,
        removeComments: true,
        sourceMap: true,
    });
    gulp.task(TASK.TYPESCRIPT_QUNIT, function () { return renderer
        .at('./tests/qunit')
        .init()
        .render(); });
    gulp.task(TASK.TYPESCRIPT_MOCHA, [
        TASK.DIST_COMMONJS
    ], function () { return renderer
        .at('./tests/mocha')
        .init()
        .module(gulp_typescript_helper_1.Module.COMMONJS)
        .render(); });
    gulp.task(TASK.BUILD + ".tests", [
        TASK.TYPESCRIPT_QUNIT,
        TASK.TYPESCRIPT_MOCHA
    ]);
});
//# sourceMappingURL=tests.js.map