(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "gulp-typescript-helper", "./constants/Paths", "gulp", "./constants/TaskNames", "../_utility/file-promise", "../source/System/Promises/Promise", "../_utility/stream-to-promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var PATH = require("./constants/Paths");
    var gulp = require("gulp");
    var TASK = require("./constants/TaskNames");
    var File = require("../_utility/file-promise");
    var Promise_1 = require("../source/System/Promises/Promise");
    var stream_to_promise_1 = require("../_utility/stream-to-promise");
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
        return stream_to_promise_1.streamToPromise.toPromise(gulp.src("./dist/README.md")
            .pipe(gulp.dest("./dist/" + folder + "/")));
    }
    var DEFAULTS = Object.freeze({
        noImplicitAny: true,
        removeComments: true,
        noEmitHelpers: true,
        sourceMap: true,
        declaration: true
    });
    var renderer = gulp_typescript_helper_1.TypeScriptRenderer
        .inject(Promise_1.Promise)
        .fromTo(PATH.SOURCE, "./dist", DEFAULTS);
    gulp.task(TASK.DIST_ES6, function () { return renderer
        .init(gulp_typescript_helper_1.Module.ES6, gulp_typescript_helper_1.Target.ES6, gulp_typescript_helper_1.Module.ES6)
        .clear()
        .render()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.ES6); }); });
    gulp.task(TASK.DIST_AMD, function () { return renderer
        .init(gulp_typescript_helper_1.Module.AMD, gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.AMD)
        .clear()
        .minify()
        .render()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.AMD); }); });
    gulp.task(TASK.DIST_UMD, function () { return renderer
        .init(gulp_typescript_helper_1.Module.UMD + '.min', gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.UMD)
        .clear()
        .minify()
        .render()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.UMD, gulp_typescript_helper_1.Module.UMD + '.min'); }); });
    gulp.task(TASK.DIST_COMMONJS, function () { return renderer
        .init(gulp_typescript_helper_1.Module.COMMONJS, gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.COMMONJS)
        .clear()
        .render()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.COMMONJS); }); });
    gulp.task(TASK.DIST_SYSTEMJS, function () { return renderer
        .init(gulp_typescript_helper_1.Module.SYSTEMJS, gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.SYSTEMJS)
        .clear()
        .render()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.SYSTEMJS); }); });
    gulp.task(TASK.DIST, [
        TASK.DIST_ES6,
        TASK.DIST_AMD,
        TASK.DIST_UMD,
        TASK.DIST_COMMONJS,
        TASK.DIST_SYSTEMJS
    ]);
});
//# sourceMappingURL=dist.js.map