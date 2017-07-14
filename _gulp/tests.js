(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "gulp-typescript-helper", "./constants/TaskNames", "gulp", "../source/System/Promises/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var TASK = require("./constants/TaskNames");
    var gulp = require("gulp");
    var Promise_1 = require("../source/System/Promises/Promise");
    var renderer = gulp_typescript_helper_1.BuildHelper
        .inject(Promise_1.TSDNPromise.factory)
        .defaults({
        target: gulp_typescript_helper_1.Target.ES5,
        module: gulp_typescript_helper_1.Module.UMD,
        noEmitHelpers: false,
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
        .addOptions({ noEmitHelpers: true })
        .at('./tests/mocha')
        .init()
        .module(gulp_typescript_helper_1.Module.COMMONJS)
        .execute(); });
});
//# sourceMappingURL=tests.js.map