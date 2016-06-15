(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./constants/Targets", "./constants/Paths", "./constants/Events", "gulp", "gulp-sourcemaps", "gulp-typescript", "gulp-replace", "del", "gulp-uglify", "../source/System/Promises/Promise", "merge2"], factory);
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
    var merge = require("merge2");
    var tsc = require("gulp-tsc");
    exports.DEFAULTS = Object.freeze({
        noImplicitAny: true,
        removeComments: true,
        noEmitHelpers: true,
        sourceMap: true
    });
    function extend(target, source) {
        var result = target || {};
        for (var _i = 0, _a = Object.keys(source); _i < _a.length; _i++) {
            var key = _a[_i];
            if (!target.hasOwnProperty(key))
                target[key] = source[key];
        }
        return result;
    }
    function ensureDefaults(target) {
        return extend(target, exports.DEFAULTS);
    }
    function getTscOptions(destination, target, module, declaration) {
        return ensureDefaults({
            tscPath: PATH.TSC,
            outDir: destination,
            module: module,
            target: target,
            declaration: !!declaration
        });
    }
    function fromTo(from, to, target, module, declaration, doNotEmit) {
        if (!doNotEmit) {
            if (module)
                console.log('TypeScript Render:', target, module, from == to ? from : (from + ' >> ' + to));
            else
                console.log('TypeScript Render:', target, from == to ? from : (from + ' >> ' + to));
        }
        var render = function () { return gulp
            .src([from + '/**/*.ts'])
            .pipe(tsc(getTscOptions(to, target, module, declaration)))
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
    function atV2(folder, target, module, noEmitHelpers, implicitAny) {
        return fromToV2(folder, folder, target, module, {
            noImplicitAny: !implicitAny,
            noEmitHelpers: !!noEmitHelpers,
        });
    }
    exports.atV2 = atV2;
    function fromToV2(from, to, target, module, options) {
        var typescriptOptions = options || {};
        if (target)
            typescriptOptions.target = target;
        if (module)
            typescriptOptions.module = module;
        typescriptOptions = ensureDefaults(typescriptOptions);
        var sourceMapOptions = {
            sourceRoot: null
        };
        console.log('TypeScript Render:', target, module, to);
        var source = from + '/**/*.ts';
        function pipeTs(g) {
            return g.pipe(sourcemaps.init())
                .pipe(typescript(typescriptOptions))
                .pipe(sourcemaps.write('.', sourceMapOptions))
                .pipe(replace(/(\n\s*$)+/gm, ""))
                .pipe(gulp.dest(to));
        }
        if (options.declaration || options.declarationFiles) {
            var tsResult = gulp.src(source)
                .pipe(typescript(typescript.createProject(options)));
            return merge([
                tsResult.dts.pipe(gulp.dest(to)),
                pipeTs(tsResult.js)
            ]);
        }
        return pipeTs(gulp.src(source));
    }
    exports.fromToV2 = fromToV2;
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