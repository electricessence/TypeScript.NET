(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./gulp/constants/Targets", "./gulp/constants/ModuleTypes", "./gulp/constants/TaskNames", "gulp", "./gulp/tsc"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TARGET = require("./gulp/constants/Targets");
    var MODULE = require("./gulp/constants/ModuleTypes");
    var TASK = require("./gulp/constants/TaskNames");
    var gulp = require("gulp");
    var tsc = require("./gulp/tsc");
    gulp.task(TASK.SOURCE, function () { return tsc.atV2('./source', TARGET.ES5, MODULE.UMD, true); });
    require("./gulp/tests");
    require("./gulp/dist");
    require("./gulp/bumpVersion");
    require("./gulp/nuget-pack");
    gulp.task(TASK.BUILD, [
        TASK.SOURCE,
        TASK.DIST,
        TASK.BUILD + ".tests"
    ]);
    gulp.task(TASK.DEFAULT, [
        TASK.SOURCE,
        TASK.DIST
    ]);
});
//# sourceMappingURL=gulpfile.js.map