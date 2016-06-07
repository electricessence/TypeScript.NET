(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./constants/Targets", "./constants/Paths", "./constants/Events", "gulp", "gulp-sourcemaps", "gulp-typescript", "gulp-replace", "del", "gulp-uglify", "../source/System/Promises/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TARGET = require("./constants/Targets");
    var PATH = require("./constants/Paths");
    var EVENT = require("./constants/Events");
    var gulp = require("gulp");
    var sourcemaps = require("gulp-sourcemaps");
    var typescript = require("gulp-typescript");
    var replace = require("gulp-replace");
    var del = require("del");
    var uglify = require("gulp-uglify");
    var Promise_1 = require("../source/System/Promises/Promise");
    var tsc = require("gulp-tsc");
    function getOptions(destination, target, module, declaration) {
        return {
            tscPath: PATH.TSC,
            outDir: destination,
            noImplicitAny: true,
            module: module,
            target: target,
            removeComments: true,
            sourceMap: true,
            declaration: !!declaration,
            noEmitHelpers: true
        };
    }
    exports.getOptions = getOptions;
    function fromTo(from, to, target, module, declaration, doNotEmit) {
        if (!doNotEmit) {
            if (module)
                console.log('TypeScript Render:', target, module, from == to ? from : (from + ' >> ' + to));
            else
                console.log('TypeScript Render:', target, from == to ? from : (from + ' >> ' + to));
        }
        var render = function () { return gulp
            .src([from + '/**/*.ts'])
            .pipe(tsc(getOptions(to, target, module, declaration)))
            .pipe(gulp.dest(to)); };
        return new Promise_1.Promise(function (resolve) {
            if (declaration) {
                gulp
                    .src([from + '/**/*.d.ts'])
                    .pipe(gulp.dest(to))
                    .on(EVENT.END, function () {
                    render()
                        .on(EVENT.END, resolve);
                });
            }
            else {
                render()
                    .on(EVENT.END, resolve);
            }
        }, true);
    }
    exports.fromTo = fromTo;
    function at(folder, target, module) {
        return fromTo(folder, folder, target, module);
    }
    exports.at = at;
    function atV2(folder, target, module, noEmitHelpers) {
        var typescriptOptions = {
            noImplicitAny: true,
            module: module,
            target: target,
            removeComments: true,
            noEmitHelpers: !!noEmitHelpers
        };
        var sourceMapOptions = {
            sourceRoot: null
        };
        console.log('TypeScript Render:', target, module, folder);
        return gulp
            .src([folder + '/**/*.ts'])
            .pipe(sourcemaps.init())
            .pipe(typescript(typescriptOptions))
            .pipe(sourcemaps.write('.', sourceMapOptions))
            .pipe(replace(/(\n\s*$)+/gm, ""))
            .pipe(gulp.dest(folder));
    }
    exports.atV2 = atV2;
    function sourceTo(folder, target, module, declaration, doNotEmit) {
        return fromTo(PATH.SOURCE, folder, target, module, declaration, doNotEmit);
    }
    exports.sourceTo = sourceTo;
    function distES6(folder, emit) {
        var d = './dist/' + folder;
        return del(d + '/**/*')
            .then(function () { return sourceTo(d, TARGET.ES6, TARGET.ES6, true, !emit); });
    }
    exports.distES6 = distES6;
    function dist(folder, target, module) {
        var d = './dist/' + folder;
        return distES6(folder)
            .then(function () { return sourceTo(d, target, module); });
    }
    exports.dist = dist;
    function distPostProcess(folder, target, module, postProcess) {
        var d = './dist/' + folder;
        console.log('TypeScript Render:', target, module, './source >> ' + d);
        var typescriptOptions = {
            noImplicitAny: true,
            module: module,
            target: target,
            removeComments: true,
            noEmitHelpers: true
        };
        var sourceMapOptions = {
            sourceRoot: null
        };
        return distES6(folder)
            .then(function () { return new Promise_1.Promise(function (resolve) {
            gulp
                .src(['./source/**/*.ts'])
                .pipe(sourcemaps.init())
                .pipe(typescript(typescriptOptions))
                .pipe(postProcess())
                .pipe(sourcemaps.write('.', sourceMapOptions))
                .pipe(gulp.dest(d))
                .on(EVENT.END, resolve);
        }, true); });
    }
    exports.distPostProcess = distPostProcess;
    function distMini(folder, target, module) {
        return distPostProcess(folder, target, module, function () { return uglify({
            preserveComments: 'license'
        }); });
    }
    exports.distMini = distMini;
});
//# sourceMappingURL=tsc.js.map