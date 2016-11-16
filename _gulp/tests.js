(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "gulp-typescript-helper", "./constants/TaskNames", "gulp", "../source/System/Promises/Promise"], function (require, exports) {
    "use strict";
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var TASK = require("./constants/TaskNames");
    var gulp = require("gulp");
    var Promise_1 = require("../source/System/Promises/Promise");
    var renderer = gulp_typescript_helper_1.BuildHelper
        .inject(Promise_1.Promise.factory)
        .defaults({
        target: gulp_typescript_helper_1.Target.ES5,
        module: gulp_typescript_helper_1.Module.UMD,
        noEmitHelpers: false,
        removeComments: true,
        sourceMap: true,
        moduleResolution: "node"
    });
    gulp.task(TASK.TYPESCRIPT_QUNIT, [
        TASK.DIST_AMD
    ], function () { return renderer
        .at('./tests/qunit')
        .init()
        .execute(); });
    gulp.task(TASK.TYPESCRIPT_MOCHA, [
        TASK.DIST_COMMONJS
    ], function () { return renderer
        .at('./tests/mocha')
        .init()
        .module(gulp_typescript_helper_1.Module.COMMONJS)
        .execute(); });
    gulp.task(TASK.BUILD + ".tests", [
        TASK.TYPESCRIPT_QUNIT,
        TASK.TYPESCRIPT_MOCHA
    ]);
});
//# sourceMappingURL=tests.js.map