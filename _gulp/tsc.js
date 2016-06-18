(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./constants/Paths", "gulp", "../source/System/Promises/Promise", "stream-to-promise-agnostic", "../source/mergeValues"], factory);
    }
})(function (require, exports) {
    "use strict";
    var PATH = require("./constants/Paths");
    var gulp = require("gulp");
    var Promise_1 = require("../source/System/Promises/Promise");
    var stream_to_promise_agnostic_1 = require("stream-to-promise-agnostic");
    var mergeValues_1 = require("../source/mergeValues");
    var tsc = require("gulp-tsc");
    var convert = stream_to_promise_agnostic_1.default(Promise_1.Promise);
    exports.DEFAULTS = Object.freeze({
        noImplicitAny: true,
        removeComments: true,
        noEmitHelpers: true,
        sourceMap: true
    });
    function ensureDefaults(target) {
        return mergeValues_1.default(target, exports.DEFAULTS);
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
        var start = declaration
            ? convert.toPromise(gulp
                .src([from + '/**/*.d.ts'])
                .pipe(gulp.dest(to)))
            : Promise_1.Promise.resolve();
        return start.then(function () { return convert.toPromise(gulp
            .src([from + '/**/*.ts'])
            .pipe(tsc(getTscOptions(to, target, module, declaration)))
            .pipe(gulp.dest(to))); });
    }
    exports.fromTo = fromTo;
    function at(folder, target, module) {
        return fromTo(folder, folder, target, module);
    }
    exports.at = at;
    function sourceTo(folder, target, module, declaration, doNotEmit) {
        return fromTo(PATH.SOURCE, folder, target, module, declaration, doNotEmit);
    }
    exports.sourceTo = sourceTo;
});
//# sourceMappingURL=tsc.js.map