(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "gulp-typescript-helper", "./constants/Paths", "gulp", "./constants/TaskNames", "../_utility/file-promise", "../_utility/stream-to-promise", "../source/System/Promises/Promise", "../source/awaiter", "../source/generator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var PATH = require("./constants/Paths");
    var gulp = require("gulp");
    var TASK = require("./constants/TaskNames");
    var File = require("../_utility/file-promise");
    var stream_to_promise_1 = require("../_utility/stream-to-promise");
    var Promise_1 = require("../source/System/Promises/Promise");
    var awaiter_1 = require("../source/awaiter");
    var generator_1 = require("../source/generator");
    // noinspection JSUnusedLocalSymbols
    var __awaiter = awaiter_1.default;
    // noinspection JSUnusedLocalSymbols
    var __generator = generator_1.default;
    var fields = {
        "name": true,
        "version": true,
        "license": true,
        "author": true,
        "description": true,
        "repository": true,
        "private": true,
        "keywords": true,
        "browser": true
    };
    function getPackage(dist) {
        return __awaiter(this, void 0, Promise_1.TSDNPromise, function () {
            var pkg, _i, _a, key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, File.json.read('./package.json')];
                    case 1:
                        pkg = _b.sent();
                        if (!pkg)
                            throw "package.json not found.";
                        for (_i = 0, _a = Object.keys(pkg); _i < _a.length; _i++) {
                            key = _a[_i];
                            if (!fields[key])
                                delete pkg[key];
                        }
                        pkg["name"] += "-" + dist;
                        return [2 /*return*/, pkg];
                }
            });
        });
    }
    function savePackage(dist, folder) {
        if (folder === void 0) { folder = dist; }
        return __awaiter(this, void 0, Promise_1.TSDNPromise, function () {
            var pkg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getPackage(dist)];
                    case 1:
                        pkg = _a.sent();
                        return [4 /*yield*/, File.json.write("./dist/" + folder + "/package.json", pkg)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, copyReadmes(folder)];
                }
            });
        });
    }
    function copyReadmes(folder) {
        return stream_to_promise_1.streamToPromise.toPromise(gulp.src("./dist/*.md")
            .pipe(gulp.dest("./dist/" + folder + "/")));
    }
    var DEFAULTS = Object.freeze({
        noImplicitAny: true,
        noEmitHelpers: true,
        removeComments: false,
        sourceMap: true,
        declaration: true,
        strictNullChecks: true,
        moduleResolution: "node"
    });
    var builder = gulp_typescript_helper_1.BuildHelper
        .inject(Promise_1.TSDNPromise.factory)
        .fromTo(PATH.SOURCE, "./dist", DEFAULTS);
    gulp.task(TASK.DIST_ES6, function () { return builder
        .init(gulp_typescript_helper_1.Module.ES6, gulp_typescript_helper_1.Target.ES6, gulp_typescript_helper_1.Module.ES6)
        .clear()
        .removeExtraneousES6Helpers()
        .execute()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.ES6); }); });
    gulp.task(TASK.DIST_AMD, function () { return builder
        .init(gulp_typescript_helper_1.Module.AMD, gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.AMD)
        .clear()
        .minify()
        .execute()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.AMD); }); });
    gulp.task(TASK.DIST_UMD, function () { return builder
        .init(gulp_typescript_helper_1.Module.UMD + '.min', gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.UMD)
        .clear()
        .minify()
        .execute()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.UMD, gulp_typescript_helper_1.Module.UMD + '.min'); }); });
    gulp.task(TASK.DIST_COMMONJS + " js-only", function () { return builder
        .init(gulp_typescript_helper_1.Module.COMMONJS + ' js-only', gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.COMMONJS)
        .addOptions({
        declaration: false,
        sourceMap: false
    })
        .clear()
        .execute()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.COMMONJS + '-js-only', gulp_typescript_helper_1.Module.COMMONJS + ' js-only'); }); });
    gulp.task(TASK.DIST_COMMONJS, function () { return builder
        .init(gulp_typescript_helper_1.Module.COMMONJS, gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.COMMONJS)
        .clear()
        .execute()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.COMMONJS); }); });
    gulp.task(TASK.DIST_SYSTEMJS, function () { return builder
        .init(gulp_typescript_helper_1.Module.SYSTEMJS, gulp_typescript_helper_1.Target.ES5, gulp_typescript_helper_1.Module.SYSTEMJS)
        .clear()
        .execute()
        .then(function () { return savePackage(gulp_typescript_helper_1.Module.SYSTEMJS); }); });
});
// gulp.task(TASK.DIST, [
// 	TASK.DIST_ES6,
// 	TASK.DIST_AMD,
// 	TASK.DIST_UMD,
// 	TASK.DIST_COMMONJS,
// 	TASK.DIST_SYSTEMJS
// ]);
// gulp.task(
// 	TASK.SOURCE,
// 	()=>{
// 		var r = typescript
// 			.at('./source', Target.ES5, Module.UMD, {noEmitHelpers: true});
// 		var s = r.sourceMapOptions;
// 		s.sourceRoot = "";
// 		s.includeContent = false;
//
// 		return r.execute()
// 	}); 
//# sourceMappingURL=dist.js.map