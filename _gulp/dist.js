(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./typescript/Targets", "./typescript/ModuleTypes", "./constants/Paths", "gulp", "./constants/TaskNames", "../_utility/file-promise", "./typescript/TypeScriptRenderer", "../_utility/stream-convert"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TARGET = require("./typescript/Targets");
    var MODULE = require("./typescript/ModuleTypes");
    var PATH = require("./constants/Paths");
    var gulp = require("gulp");
    var TASK = require("./constants/TaskNames");
    var File = require("../_utility/file-promise");
    var TypeScriptRenderer_1 = require("./typescript/TypeScriptRenderer");
    var stream_convert_1 = require("../_utility/stream-convert");
    var fields = {
        "name": true,
        "version": true,
        "license": true,
        "author": true,
        "description": true,
        "repository": true,
        "private": true,
        "keywords": true
    };
    function getPackage(dist) {
        return File.json.read('./package.json')
            .then(function (pkg) {
            for (var _i = 0, _a = Object.keys(pkg); _i < _a.length; _i++) {
                var key = _a[_i];
                if (!fields[key])
                    delete pkg[key];
            }
            pkg["name"] += "-" + dist;
            return pkg;
        });
    }
    function savePackage(dist, folder) {
        if (folder === void 0) { folder = dist; }
        return getPackage(dist)
            .then(function (pkg) { return File.json.write("./dist/" + folder + "/package.json", pkg); })
            .then(function () { return copyReadme(folder); });
    }
    function copyReadme(folder) {
        return stream_convert_1.toPromise(gulp.src("./dist/README.md")
            .pipe(gulp.dest("./dist/" + folder + "/")));
    }
    var DEFAULTS = Object.freeze({
        noImplicitAny: true,
        removeComments: true,
        noEmitHelpers: true,
        sourceMap: true,
    });
    var renderer = TypeScriptRenderer_1.TypeScriptRendererFactory.fromTo(PATH.SOURCE, "./dist", DEFAULTS);
    gulp.task(TASK.DIST_ES6, function () { return renderer
        .init(MODULE.ES6, TARGET.ES6, MODULE.ES6)
        .clear()
        .render()
        .then(function () { return savePackage(MODULE.ES6); }); });
    gulp.task(TASK.DIST_AMD, function () { return renderer
        .init(MODULE.AMD, TARGET.ES5, MODULE.AMD)
        .clear()
        .minify()
        .render()
        .then(function () { return savePackage(MODULE.AMD); }); });
    gulp.task(TASK.DIST_UMD, function () { return renderer
        .init(MODULE.UMD + '.min', TARGET.ES5, MODULE.UMD)
        .clear()
        .minify()
        .render()
        .then(function () { return savePackage(MODULE.UMD, MODULE.UMD + '.min'); }); });
    gulp.task(TASK.DIST_COMMONJS, function () { return renderer
        .init(MODULE.COMMONJS, TARGET.ES5, MODULE.COMMONJS)
        .clear()
        .render()
        .then(function () { return savePackage(MODULE.COMMONJS); }); });
    gulp.task(TASK.DIST_SYSTEMJS, function () { return renderer
        .init(MODULE.SYSTEMJS, TARGET.ES5, MODULE.SYSTEMJS)
        .clear()
        .render()
        .then(function () { return savePackage(MODULE.SYSTEMJS); }); });
    gulp.task(TASK.DIST, [
        TASK.DIST_ES6,
        TASK.DIST_AMD,
        TASK.DIST_UMD,
        TASK.DIST_COMMONJS,
        TASK.DIST_SYSTEMJS
    ]);
});
//# sourceMappingURL=dist.js.map