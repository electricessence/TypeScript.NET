(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "gulp-typescript-helper", "./constants/TaskNames", "gulp", "../source/System/Promises/Functions/create"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var TASK = require("./constants/TaskNames");
    var gulp = require("gulp");
    var create_1 = require("../source/System/Promises/Functions/create");
    var renderer = gulp_typescript_helper_1.BuildHelper
        .inject(create_1.default)
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
        //.target(Target.ES6)
        .at('./tests/mocha')
        .init()
        .module(gulp_typescript_helper_1.Module.COMMONJS)
        .execute(); });
});
//# sourceMappingURL=tests.js.map