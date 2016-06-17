/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./constants/Paths", "gulp", "gulp-sourcemaps", "gulp-typescript", "gulp-replace", "merge2", "./stream-convert", "./TypeScriptRendererBase", "../source/extends", "../source/mergeValues"], factory);
    }
})(function (require, exports) {
    "use strict";
    var PATH = require("./constants/Paths");
    var gulp = require("gulp");
    var sourcemaps = require("gulp-sourcemaps");
    var typescript = require("gulp-typescript");
    var replace = require("gulp-replace");
    var mergeStreams = require("merge2");
    var StreamConvert = require("./stream-convert");
    var TypeScriptRendererBase_1 = require("./TypeScriptRendererBase");
    var extends_1 = require("../source/extends");
    var mergeValues_1 = require("../source/mergeValues");
    var __extends = extends_1.default;
    var REMOVE_EMPTY_LINES_REGEX = /(\n\s*$)+/gm;
    var TypeScriptRenderer = (function (_super) {
        __extends(TypeScriptRenderer, _super);
        function TypeScriptRenderer() {
            _super.apply(this, arguments);
        }
        TypeScriptRenderer.prototype.onRender = function () {
            var options = this.compilerOptions, from = this.sourceFolder, to = this.destinationFolder;
            var declaration = options.declaration || options.declarationFiles;
            var tsStart = gulp.src(from + '/**/*.ts');
            if (options.sourceMap)
                tsStart = tsStart.pipe(sourcemaps.init());
            var tsResult = tsStart.pipe(typescript(options));
            var js = declaration ? tsResult.js : tsResult;
            if (this._minify)
                js = js.pipe(this.getPostProcess());
            if (options.sourceMap)
                js = js.pipe(sourcemaps.write('.', this.sourceMapOptions));
            js = js.pipe(replace(REMOVE_EMPTY_LINES_REGEX, ""));
            var stream = declaration
                ?
                    mergeStreams([
                        gulp.src([from + '/**/*.d.ts']),
                        tsResult.dts,
                        js
                    ])
                : js;
            return StreamConvert.toPromise(stream.pipe(gulp.dest(to)));
        };
        return TypeScriptRenderer;
    }(TypeScriptRendererBase_1.TypeScriptRendererBase));
    exports.TypeScriptRenderer = TypeScriptRenderer;
    function at(folder, target, module, options) {
        if (options === void 0) { options = {
            noImplicitAny: false,
            noEmitHelpers: false
        }; }
        options = mergeValues_1.default({}, options);
        if (target)
            options.target = target;
        if (module)
            options.module = module;
        return new TypeScriptRenderer(folder, folder, options);
    }
    exports.at = at;
    function sourceTo(folder, target, module, options) {
        options = mergeValues_1.default({}, options);
        if (target)
            options.target = target;
        if (module)
            options.module = module;
        return new TypeScriptRenderer(PATH.SOURCE, folder, options);
    }
    exports.sourceTo = sourceTo;
    function dist(folder, target, module) {
        var d = './dist/' + folder;
        return sourceTo(d, target, module, { declaration: true }).clear();
    }
    exports.dist = dist;
});
//# sourceMappingURL=typescript.js.map