(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./constants/Targets", "./constants/ModuleTypes", "gulp", "./tsc", "./constants/TaskNames"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TARGET = require("./constants/Targets");
    var MODULE = require("./constants/ModuleTypes");
    var gulp = require("gulp");
    var tsc = require("./tsc");
    var TASK = require("./constants/TaskNames");
    gulp.task(TASK.DIST_ES6, function () { return tsc.distES6(TARGET.ES6, true); });
    gulp.task(TASK.DIST_AMD, function () { return tsc.distMini(MODULE.AMD, TARGET.ES5, MODULE.AMD); });
    gulp.task(TASK.DIST_UMD, function () { return tsc.distMini(MODULE.UMD + '.min', TARGET.ES5, MODULE.UMD); });
    gulp.task(TASK.DIST_COMMONJS, function () { return tsc.dist(MODULE.COMMONJS, TARGET.ES5, MODULE.COMMONJS); });
    gulp.task(TASK.DIST_SYSTEMJS, function () { return tsc.dist(MODULE.SYSTEMJS, TARGET.ES5, MODULE.SYSTEMJS); });
    gulp.task(TASK.DIST, [
        TASK.DIST_ES6,
        TASK.DIST_AMD,
        TASK.DIST_UMD,
        TASK.DIST_COMMONJS,
        TASK.DIST_SYSTEMJS
    ]);
});
//# sourceMappingURL=dist.js.map