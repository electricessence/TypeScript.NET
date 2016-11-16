(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "gulp-typescript-helper", "./constants/Paths", "./constants/TaskNames", "gulp", "gulp-typedoc"], function (require, exports) {
    "use strict";
    var gulp_typescript_helper_1 = require("gulp-typescript-helper");
    var PATH = require("./constants/Paths");
    var TASK = require("./constants/TaskNames");
    var gulp = require("gulp");
    var typedoc = require("gulp-typedoc");
    gulp.task(TASK.TYPEDOC, function () {
        var typedocOptions = {
            name: 'TypeScript.NET',
            out: PATH.DOCS,
            module: gulp_typescript_helper_1.Module.UMD,
            target: gulp_typescript_helper_1.Target.ES5,
            excludeNotExported: true,
            includeDeclarations: true,
            ignoreCompilerErrors: false,
            version: true
        };
        console.log('Building TypeDocs...');
        return gulp
            .src(PATH.SOURCE)
            .pipe(typedoc(typedocOptions));
    });
});
//# sourceMappingURL=typedoc.js.map